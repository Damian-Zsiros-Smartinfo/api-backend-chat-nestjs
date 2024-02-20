import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserService } from '../servicios/user.service';
import { UserCaseUse } from 'src/user/aplicacion/user.case.use';
import { UserData } from 'src/user/dominio/valueobject/user.value';

interface UserVerify {
  email: string;
  password: string;
}

@Controller('auth')
export class LoginController {
  private readonly userCaseUse: UserCaseUse;
  constructor(userService: UserService) {
    this.userCaseUse = new UserCaseUse(userService);
  }
  @Post('/login')
  async login(@Body() { email, password }: UserVerify) {
    try {
      if (!email) throw new Error();
      const res = await this.userCaseUse.login({ email, password });
      if (!res.logued) throw new Error(res.error.message);
      return res;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
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

  @Post('/register')
  async register(@Body() info: Partial<UserData>) {
    try {
      if (!info.email) throw new Error();
      const res = await this.userCaseUse.register(info);
      if (!res.registered) throw new Error(res.error.message);
      return res;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        throw new HttpException(
          {
            registered: false,
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
}
