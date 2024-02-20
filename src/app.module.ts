import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';
import { Chat } from './chat/chat.entity';
import { ChatMessage } from './chat/chatMessage.entity';
import { UserModel } from './user/infraestructura/modelos/user.model';
import { User } from './auth/auth.entity';
import { OtpCode } from './auth/otpCode.entity';
import { Image } from './chat/image.entity';
import { ConfigModule } from '@nestjs/config';
import { PasswordRecoverModule } from './auth/password-recover/password-recover.module';
import { TypeOrmConfigModule } from './typeorm/typeorm.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host:
        process.env.SUPABASE_DATABASE_HOST ||
        'aws-0-us-west-1.pooler.supabase.com',
      port: parseInt(process.env.SUPABASE_DATABASE_PORT || '5432'),
      username:
        process.env.SUPABASE_DATABASE_USERNAME ||
        'postgres.foibkefrwjqhwldayawb',
      password: process.env.SUPABASE_DATABASE_PASSWORD || 'sbj2WCKdeiuUhhWG',
      database: process.env.SUPABASE_DATABASE_NAME || 'postgres',
      synchronize: true,
      entities: [Chat, ChatMessage, Image, User, OtpCode, UserModel],
    }),
    AuthModule,
    ChatModule,
    PasswordRecoverModule,
    TypeOrmConfigModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
