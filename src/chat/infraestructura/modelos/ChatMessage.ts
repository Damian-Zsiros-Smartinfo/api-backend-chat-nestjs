import { type InterfaceChatMessageEntity } from 'src/chat/dominio/entities/chat_message.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class ChatMessages
  extends BaseEntity
  implements InterfaceChatMessageEntity
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column({ nullable: false, default: 'Damian' })
  nameSender!: string;

  @Column({ type: 'timestamp', default: new Date() })
  created_at: Date;

  @Column()
  id_chat: number;
}
