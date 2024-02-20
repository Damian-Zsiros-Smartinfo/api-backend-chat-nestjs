import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserModel } from 'src/user/infraestructura/modelos/user.model';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    const authHeaderString = authHeader?.toString() || '';

    if (!authHeader) {
      throw new UnauthorizedException({
        error: { message: 'Token must be provided' },
      });
    }

    try {
      const token = this.jwtService.verify(authHeaderString);

      if (!token) {
        throw new UnauthorizedException({ message: 'Token is not valid' });
      }

      const userInfoToken = this.jwtService.verify(
        authHeaderString,
      ) as UserModel;

      if (!userInfoToken.id) {
        throw new UnauthorizedException({ message: 'Token is not valid' });
      }

      const userExists = await UserModel.getRepository().findBy({
        id: userInfoToken.id,
      });

      if (userExists.length > 0) {
        throw new UnauthorizedException({ message: 'Token is not valid' });
      }

      request.user = userInfoToken;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException({
        error: { message: error.message },
      });
    }
  }
}
