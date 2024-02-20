import { Module } from '@nestjs/common';
import { ChatController } from './infraestructura/controladores/chat.controller';
import { ChatMessageService } from './infraestructura/servicios/chat_message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessages } from './infraestructura/modelos/ChatMessage';
import { Chat } from './infraestructura/modelos/Chat';
import { Image } from './infraestructura/modelos/Image';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ChatController],
  providers: [ChatMessageService],
  imports: [
    TypeOrmModule.forFeature([Image, ChatMessages, Chat]),
    JwtModule.register({}),
  ],
})
export class ChatModule {}
