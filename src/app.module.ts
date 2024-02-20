import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';
import { Chat as ChatHex } from './chat/infraestructura/modelos/Chat';
import { UserModel } from './user/infraestructura/modelos/user.model';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ChatMessages } from './chat/infraestructura/modelos/ChatMessage';
import { Image } from './chat/infraestructura/modelos/Image';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.SUPABASE_DATABASE_HOST || 'localhost',
      port: parseInt(process.env.SUPABASE_DATABASE_PORT || '5432'),
      username: process.env.SUPABASE_DATABASE_USERNAME || 'postgres',
      password: process.env.SUPABASE_DATABASE_PASSWORD || '123456',
      database: process.env.SUPABASE_DATABASE_NAME || 'proyecto-integracion',
      synchronize: true,
      logging: true,
      entities: [Image, UserModel, ChatMessages, ChatHex],
    }),
    ChatModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
