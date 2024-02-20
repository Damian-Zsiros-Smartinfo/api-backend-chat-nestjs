import { ChatMessageService } from './../servicios/chat_message.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { getChatMessages } from '../../../services/chatService';
import { ChatMessageUseCase } from 'src/chat/aplicacion/chat_message.case.use';
import { JwtAuthGuard } from '../../dominio/guard/auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  private readonly userCaseUse: ChatMessageUseCase;
  constructor(userService: ChatMessageService) {
    this.userCaseUse = new ChatMessageUseCase(userService);
  }
  @Get('/messages')
  async getMessages() {
    try {
      const messages = await getChatMessages();
      return {
        messages,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          {
            registered: false,
            error: { message: error.message },
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: {
              message: error.message,
            },
          },
        );
      }
    }
  }

  @Post('/messages')
  async sendMessages(
    @Body() { message, nameSender }: { message: string; nameSender: string },
  ) {
    try {
      const messages = await this.userCaseUse.sendMessage({
        message,
        nameSender,
      });
      return {
        messages,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          {
            registered: false,
            error: { message: error.message },
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: {
              message: error.message,
            },
          },
        );
      }
    }
  }
}
