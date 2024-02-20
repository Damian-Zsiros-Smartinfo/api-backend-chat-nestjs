import { InterfaceEntityUser } from '../entities/user.entity';

export class UserData implements InterfaceEntityUser {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;

  constructor(id, name, email, phone, password, createdAt) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.createdAt = createdAt;
  }
}
