import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from '../modelos/user.model';
import { UserData } from 'src/user/dominio/valueobject/user.value';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async getUserByEmail(email: string): Promise<UserModel | undefined> {
    if (!email) {
      throw new Error('Email is required');
    }
    return await this.userRepository.findOne({ where: { email } }); // Cambio aquí
  }

  async getUserByPhone(phone: string): Promise<UserModel | undefined> {
    if (!phone) {
      throw new Error('Phone is required');
    }
    return await this.userRepository.findOne({ where: { phone } }); // Cambio aquí
  }

  async existsUser(info: Partial<UserData>) {
    return (await this.userRepository.findOne({ where: info })) != null;
  }
}
