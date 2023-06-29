import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';
import { MailServices } from '../shared/services/mail.service';
import { AwsService } from '../shared/services/aws.service';
import { UserModule } from '../user/user.module';
import { AccountService } from '../account/account.service';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60d' },
    }),
  ],
  controllers: [ AuthController ],
  providers: [AuthService, LocalStrategy, GoogleStrategy, JwtStrategy, MailServices, AwsService, AccountService],
  exports: [AuthService],
})
export class AuthModule {}