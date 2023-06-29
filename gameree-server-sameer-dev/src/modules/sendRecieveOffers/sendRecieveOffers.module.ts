import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SendRecieveOffersController } from './sendRecieveOffers.controller';
import { SendRecieveOffersService } from './sendRecieveOffers.service';
import { MarketplaceService } from '../marketplace/marketplace.service';
import { ContractService } from '../shared/services/contract.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SendRecieveOffersController],
  providers: [SendRecieveOffersService, MarketplaceService, ContractService],
  exports: [SendRecieveOffersService],
})
export class SendRecieveOffersModule {}
