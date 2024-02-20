import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as http from 'http';
import { Server } from 'socket.io';
import { getChatMessages } from './services/chatService';
import { Image } from './chat/infraestructura/modelos/Image';
import { ChatMessages } from './chat/infraestructura/modelos/ChatMessage';
async function bootstrap() {
  const PORT = process.env.PORT || 4500;
  const app = await NestFactory.create(AppModule);
  const httpServer = http.createServer(app.getHttpAdapter().getInstance());

  app.useWebSocketAdapter(new IoAdapter(httpServer));

  // Configuración de CORS, middlewares, etc., si es necesario para Express
  // ...
  app.enableCors();

  await app.listen(PORT);

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
    maxHttpBufferSize: 10e7,
  });
  io.on('connection', async (socket) => {
    console.log({ message: 'a new client connected', id: socket.id });
    socket.join('chat');
    socket.broadcast.emit('server:loadmessages', await getChatMessages());
    socket.on('server:addMessage', async function (data) {
      try {
        const chatMessageNew = new ChatMessages();
        chatMessageNew.message = data.text;
        chatMessageNew.id_chat = 1;
        chatMessageNew.nameSender = data.actor;
        await chatMessageNew.save();
        const chatMessageAdded = chatMessageNew;
        const imagesFile: {
          file: { name: string };
          arrayBuffer: Buffer;
          image: string;
        }[] = data.images;
        await imagesFile.forEach(async (image) => {
          const imageNew = new Image();
          imageNew.idMessage = chatMessageAdded.id;
          imageNew.image = image.image;
          await imageNew.save();
        });
        socket.broadcast.emit('server:loadmessages', await getChatMessages());
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
        }
      }
    });
    socket.on('server:editMessage', async function (data) {
      const {
        messageId,
        messageEdited,
      }: { messageId: string; messageEdited: string } = data;
      const messagesRepository = ChatMessages.getRepository();
      const message =
        (await messagesRepository.findOneBy({ id: parseInt(messageId) })) ||
        new ChatMessages();
      message.message = messageEdited;
      await messagesRepository.save(message);

      socket.broadcast.emit('server:loadmessages', await getChatMessages());
    });

    socket.on('server:deleteMessage', async function (data) {
      const messagesRepository = ChatMessages.getRepository();
      await messagesRepository.delete({ id: parseInt(data) });

      socket.broadcast.emit('server:loadmessages', await getChatMessages());
    });

    socket.on('disconnect', () => {
      console.log({ message: 'a client disconnected', id: socket.id });
    });
  });
}
bootstrap();
