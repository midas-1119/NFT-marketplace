
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AwsService } from '../shared/services/aws.service';
import { MailServices } from '../shared/services/mail.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [ DatabaseModule ],
  controllers: [UserController],
  providers: [UserService, AwsService,MailServices],
  exports: [UserService]
})
export class UserModule {}