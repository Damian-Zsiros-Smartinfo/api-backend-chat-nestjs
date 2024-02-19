import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './auth.entity';

@Entity()
export class OtpCode extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  code: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'id_user' })
  idUser: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
