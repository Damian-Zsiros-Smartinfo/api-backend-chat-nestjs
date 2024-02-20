import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { generateToken } from '../../utils/JWTUtils';
import { User } from '../auth.entity';
import * as bcrypt from 'bcryptjs';

interface UserVerify {
  email: string;
  password: string;
}

@Controller('auth/login/sadsad')
export class LoginController {
  @Post()
  async login(@Body() body: { email: string; password: string }) {
    try {
      const { email, password } = body;
      const userData: UserVerify = { email: body.email, password };
      if (!userData.email) throw new Error();
      const {
        id,
        name,
        phone,
        password: passwordHashed,
        createdAt,
      } = (await User.getRepository().findOneBy({
        email: userData.email,
      })) || {};
      if (!userData.password) throw new Error('Password is required');
      if (
        !(await bcrypt.compareSync(userData.password, passwordHashed || ''))
      ) {
        throw new HttpException(
          {
            logued: false,
            error: {
              message: 'Invalid credentials',
            },
          },
          HttpStatus.FORBIDDEN,
          {
            cause: 'Invalid credentials',
          },
        );
      }
      const dataUserFinal = {
        id,
        email,
        name,
        phone,
        passwordHashed,
        createdAt,
      };
      const token = generateToken(dataUserFinal, { expiresIn: '1d' });
      console.log(token);
      return {
        logued: true,
        user: dataUserFinal,
        token,
      };
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          {
            logued: false,
            error: { message: error.message },
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
          {
            cause: error,
          },
        );
    }
  }
}
