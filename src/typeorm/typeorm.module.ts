// typeorm.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Chat } from '../chat/chat.entity';
import { ChatMessage } from '../chat/chatMessage.entity';
import { User } from '../auth/auth.entity';
import { Image } from '../chat/image.entity';
import { OtpCode } from '../auth/otpCode.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host:
          configService.get('SUPABASE_DATABASE_HOST') ||
          'aws-0-us-west-1.pooler.supabase.com',
        port: parseInt(configService.get('SUPABASE_DATABASE_PORT')) || 5432,
        username:
          configService.get('SUPABASE_DATABASE_USERNAME') ||
          'postgres.foibkefrwjqhwldayawb',
        password:
          configService.get('SUPABASE_DATABASE_PASSWORD') || 'sbj2WCKdeiuUhhWG',
        database: configService.get('SUPABASE_DATABASE_NAME') || 'postgres',
        synchronize: true,
        entities: [Chat, ChatMessage, Image, User, OtpCode],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class TypeOrmConfigModule {}
