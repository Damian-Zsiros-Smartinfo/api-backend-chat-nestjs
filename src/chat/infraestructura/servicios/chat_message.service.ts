import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessages } from '../modelos/ChatMessage';
import { Repository } from 'typeorm';
import { type InterfaceChatMessageRepository } from 'src/chat/dominio/repository/chat_message.repository';
import { ChatMessageData } from 'src/chat/dominio/valueobjects/chat_message.value';
import { Image } from '../modelos/Image';

@Injectable()
export class ChatMessageService implements InterfaceChatMessageRepository {
  constructor(
    @InjectRepository(ChatMessages)
    private readonly chatMessagesRepository: Repository<ChatMessages>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async getMessages(): Promise<any[]> {
    try {
      const chat_messages = await this.chatMessagesRepository.find();

      if (!chat_messages) throw new Error();

      const messagesWithImagesPromises = chat_messages.map(async (message) => {
        const messageInfo = message;

        const images_messages = await this.imageRepository.find({
          where: { idMessage: messageInfo.id },
          relations: ['idMessage'],
        });

        return {
          id: messageInfo.id,
          actor: messageInfo.nameSender,
          text: messageInfo.message,
          images: images_messages,
          created_at: messageInfo.created_at || '',
        };
      });

      const messagesWithImages = await Promise.all(messagesWithImagesPromises);
      return messagesWithImages as unknown as any; // <-- Convertir el tipo aquí
    } catch (error) {
      console.error(error);
      // Puedes manejar el error o simplemente rechazar la promesa con throw error
      throw error;
    }
  }

  async sendMessage(infoMessage: {
    message: string;
    nameSender: string;
    id_chat: number | 1;
  }): Promise<Partial<ChatMessageData>> {
    const newMessage = new ChatMessages();
    newMessage.message = infoMessage.message;
    newMessage.nameSender = infoMessage.nameSender;
    newMessage.id_chat = infoMessage.id_chat;
    await newMessage.save();
    console.log(newMessage);
    return newMessage;
  }
}
