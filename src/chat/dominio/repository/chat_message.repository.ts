import { ChatMessageData } from '../valueobjects/chat_message.value';

export interface InterfaceChatMessageRepository {
  sendMessage(
    infoMessage: Partial<ChatMessageData>,
  ): Promise<Partial<ChatMessageData>>;

  getMessages(): Promise<any[]>;
}
