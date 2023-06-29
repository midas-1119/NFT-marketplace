import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './modules/account/account.module';
import { ActivityModule } from './modules/activity/activity.module';
import { AssetsModule } from './modules/assets/assets.module';
import { AuthModule } from './modules/auth/auth.module';
import { GoogleStrategy } from './modules/auth/google.strategy';
import { DatabaseModule } from './modules/database/database.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { SendRecieveOffersModule } from './modules/sendRecieveOffers/sendRecieveOffers.module';
import { PaymentModule } from './modules/payments/payment.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    AccountModule,
    MarketplaceModule,
    SendRecieveOffersModule,
    ActivityModule,
    PaymentModule,
    AssetsModule,
    // GoogleStrategy,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: 'no-reply@gameree.net',
          pass: 'Check@2269',
        },
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
