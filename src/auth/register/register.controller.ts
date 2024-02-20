import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { User } from '../auth.entity';
import * as bcrypt from 'bcryptjs';

@Controller('auth/registerdasdas')
export class RegisterController {
  @Post()
  async register(
    @Body()
    body: {
      email: string;
      name: string;
      password: string;
      phone: string;
    },
  ) {
    try {
      const { email, name, password, phone } = body;
      const userData = { email, name, password, phone };
      const existNumberPhone =
        (await User.findBy({ phone: userData.phone })).length > 0;
      if (existNumberPhone) {
        throw new HttpException(
          {
            registered: false,
            exists: existNumberPhone,
            error: {
              message: 'Telefono ya registrado. Intentelo de nuevo.',
            },
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: {
              message: 'Telefono ya registrado. Intentelo de nuevo.',
            },
          },
        );
      }
      const isSavedUserActual =
        (await User.findBy({ email: userData.email })).length > 0;
      if (isSavedUserActual) {
        throw new HttpException(
          {
            registered: false,
            exists: isSavedUserActual,
            error: {
              message: 'Email ya registrado. Intentelo de nuevo.',
            },
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: {
              message: 'Email ya registrado. Intentelo de nuevo.',
            },
          },
        );
      }
      if (!process.env.SALT_ENCRYPT_PASSWORDS) throw new Error();
      const salt = bcrypt.genSaltSync(
        parseInt(process.env.SALT_ENCRYPT_PASSWORDS),
      );
      const passwordHashed = bcrypt.hashSync(password, salt);
      const userNew = new User();
      userNew.name = name;
      userNew.email = email;
      userNew.password = passwordHashed;
      userNew.phone = phone;
      await userNew.save();
      return {
        registered: true,
        user: userData,
      };
    } catch (error: any) {
      console.error(error);
      if (error instanceof Error) {
        throw new HttpException(
          {
            registered: false,
            error: { message: error.message },
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: {
              message: error.message,
            },
          },
        );
      }
    }
  }
}
