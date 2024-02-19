import { Injectable } from '@nestjs/common';
import { ChatMessage } from '../chat/chatMessage.entity';
import { Image as ImageEntity } from '../chat/image.entity';
@Injectable()
export class AuthService {
  async getChatMessages() {
    try {
      const chat_messages = await ChatMessage.find();

      if (!chat_messages) throw new Error();

      const messagesWithImagesPromises = chat_messages.map(async (message) => {
        const messageInfo: ChatMessage = message;

        const images_messages = await ImageEntity.find({
          where: { idMessage: { id: messageInfo.id } },
          relations: ['idMessage'],
        });

        return {
          id: messageInfo.id,
          actor: messageInfo.name_sender,
          text: messageInfo.message,
          images: images_messages,
          created_at: messageInfo.createdAt || '',
        };
      });

      const messagesWithImages = await Promise.all(messagesWithImagesPromises);
      return messagesWithImages;
    } catch (error) {
      console.error(error);
    }
    return [];
  }
}
