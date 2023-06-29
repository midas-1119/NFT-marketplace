import { Module } from '@nestjs/common';
import { AssetsService } from '../assets/assets.service';
import { DatabaseModule } from '../database/database.module';
import { MarketplaceService } from '../marketplace/marketplace.service';
import { MailServices } from '../shared/services/mail.service';
import { StripeService } from '../stripe/stripe.service';
import { UserService } from '../user/user.service';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ContractService } from '../shared/services/contract.service';
import { SendRecieveOffersService } from '../sendRecieveOffers/sendRecieveOffers.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    StripeService,
    UserService,
    MarketplaceService,
    MailServices,
    AssetsService,
    ContractService,
    SendRecieveOffersService,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
