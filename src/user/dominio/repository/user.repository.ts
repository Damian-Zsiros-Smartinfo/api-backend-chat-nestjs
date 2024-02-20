import { type UserData } from '../valueobject/user.value';
export interface InterfaceUserRepository {
  getUserByEmail(email: string): Promise<Partial<UserData>>;
  getUserByPhone(phone: string): Promise<Partial<UserData>>;
  existsUser(infoWhere: Partial<UserData>): Promise<boolean>;
}
