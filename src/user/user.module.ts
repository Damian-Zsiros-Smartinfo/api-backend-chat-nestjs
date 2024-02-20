import { Module } from '@nestjs/common';
import { LoginController } from './infraestructura/controladores/user.controller';
import { UserService } from './infraestructura/servicios/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './infraestructura/modelos/user.model';

@Module({
  controllers: [LoginController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([UserModel])],
})
export class UserModule {}
