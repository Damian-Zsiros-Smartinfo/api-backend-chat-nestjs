import { type InterfaceChatMessageRepository } from '../dominio/repository/chat_message.repository';
import { ChatMessageData } from '../dominio/valueobjects/chat_message.value';

export class ChatMessageUseCase {
  private readonly chatMessageUseCase: InterfaceChatMessageRepository;

  constructor(chatMessageUseCase: InterfaceChatMessageRepository) {
    this.chatMessageUseCase = chatMessageUseCase;
  }

  async sendMessage({
    message,
    nameSender,
    id_chat = 1,
  }: Partial<ChatMessageData>) {
    if (!message || !nameSender) {
      return {
        status: 400,
        sended: false,
        error: {
          message: 'Message and name of sender is required',
        },
      };
    }
    const res = await this.chatMessageUseCase.sendMessage({
      message,
      nameSender,
      id_chat,
    });
    return res;
  }

  async getMessages() {
    return await this.chatMessageUseCase.getMessages();
  }
}
