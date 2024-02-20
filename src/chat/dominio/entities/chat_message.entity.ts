import { Image } from 'src/chat/infraestructura/modelos/Image';

export interface InterfaceChatMessageEntity {
  id?: number;
  id_chat: number;
  message: string;
  nameSender: string;
  created_at: Date;
  images?: Image[];
}
