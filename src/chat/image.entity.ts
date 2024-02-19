import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatMessage } from './chatMessage.entity';

@Entity('images')
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChatMessage, (chatMessage) => chatMessage.id, {
    eager: true,
  })
  @JoinColumn({ name: 'idMessage' })
  idMessage: { id: number | 0 } | number;

  @Column()
  image: string;

  @CreateDateColumn()
  created_at: Date;
}
