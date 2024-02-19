import { Module } from '@nestjs/common';
import { PasswordRecoverController } from './password-recover.controller';

@Module({
  controllers: [PasswordRecoverController],
})
export class PasswordRecoverModule {}
