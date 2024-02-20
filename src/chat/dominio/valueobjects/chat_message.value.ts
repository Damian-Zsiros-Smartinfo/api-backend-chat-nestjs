import { Image } from 'src/chat/infraestructura/modelos/Image';
import { InterfaceChatMessageEntity } from '../entities/chat_message.entity';

export class ChatMessageData implements InterfaceChatMessageEntity {
  id?: number;
  id_chat: number;
  message: string;
  nameSender: string;
  created_at: Date;
  images?: Image[];

  constructor(
    id: number,
    id_chat: number,
    message: string,
    nameSender: string,
    created_at: Date,
    images: Image[],
  ) {
    this.id = id;
    this.id_chat = id_chat;
    this.message = message;
    this.nameSender = nameSender;
    this.created_at = created_at;
    this.images = images || [];
  }
}
