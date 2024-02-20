import { generateToken } from '../../utils/JWTUtils';
import { InterfaceUserRepository } from '../dominio/repository/user.repository';
import { UserData } from '../dominio/valueobject/user.value';
import * as bcrypt from 'bcryptjs';
import { UserModel } from '../infraestructura/modelos/user.model';
export class UserCaseUse {
  private readonly userCase: InterfaceUserRepository;

  constructor(userCase: InterfaceUserRepository) {
    this.userCase = userCase;
  }

  async login({ email, password }: Partial<UserData>) {
    const {
      password: passwordHashed,
      id,
      name,
      phone,
      createdAt,
    } = await this.userCase.getUserByEmail(email);
    console.log({
      password: passwordHashed,
      id,
      name,
      phone,
      createdAt,
    });
    if (!(await bcrypt.compareSync(password, passwordHashed || ''))) {
      return {
        status: 403,
        logued: false,
        error: {
          message: 'Invalid credentials',
        },
      };
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
    return {
      status: 200,
      logued: true,
      user: dataUserFinal,
      token,
    };
  }

  async register({ email, password, name, phone }: Partial<UserData>) {
    const existUserBool =
      (await this.userCase.existsUser({ phone })) ||
      (await this.userCase.existsUser({ email }));

    if (existUserBool)
      return {
        status: 400,
        registered: false,
        error: {
          message: 'Usuario ya existente. Intenta con otro telefono o email',
        },
      };

    if (!process.env.SALT_ENCRYPT_PASSWORDS) throw new Error();
    const salt = bcrypt.genSaltSync(
      parseInt(process.env.SALT_ENCRYPT_PASSWORDS),
    );
    const passwordHashed = bcrypt.hashSync(password, salt);
    const userNew = new UserModel();
    userNew.name = name;
    userNew.email = email;
    userNew.password = passwordHashed;
    userNew.phone = phone;
    await userNew.save();
    return {
      registered: true,
      user: { email, password: passwordHashed, name, phone },
    };
  }
}
