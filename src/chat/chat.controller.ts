import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { getChatMessages } from '../services/chatService';

@Controller('chat')
export class ChatController {
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
}
