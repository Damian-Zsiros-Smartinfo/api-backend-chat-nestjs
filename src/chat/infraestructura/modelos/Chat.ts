import { InterfaceChatEntity } from 'src/chat/dominio/entities/chat.entity';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';

@Entity()
export class Chat implements InterfaceChatEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column()
  name: string;

  @Column()
  created_at: Date;
}
