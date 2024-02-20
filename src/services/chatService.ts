import { ChatMessages } from 'src/chat/infraestructura/modelos/ChatMessage';
import { Image as ImageEntity } from '../chat/infraestructura/modelos/Image';
export async function getChatMessages() {
  try {
    const chat_messages = await ChatMessages.find();

    if (!chat_messages) throw new Error();

    const messagesWithImagesPromises = chat_messages.map(async (message) => {
      const messageInfo: ChatMessages = message;

      const images_messages = await ImageEntity.getRepository().find({
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
    return messagesWithImages;
  } catch (error) {
    console.error(error);
  }
  return [];
}
