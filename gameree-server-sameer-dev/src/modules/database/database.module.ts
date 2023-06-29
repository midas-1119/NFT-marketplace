import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { usersProviders } from '../user/user.provider';
import {
  bidProviders,
  listingProviders,
  marketplaceProviders,
  tokenProviders,
} from '../marketplace/marketplace.provider';
import { accountProviders } from '../account/account.provider';
import { sendRecieveOffersProviders } from '../sendRecieveOffers/sendRecieveOffers.provider';
import { activityProviders } from '../activity/activity.provider';
import { paymentProviders } from '../payments/payment.provider';
import { assetsProviders } from '../assets/assets.provider';

@Module({
  providers: [
    ...databaseProviders,
    ...usersProviders,
    ...marketplaceProviders,
    ...accountProviders,
    ...activityProviders,
    ...listingProviders,
    ...tokenProviders,
    ...bidProviders,
    ...paymentProviders,
    ...assetsProviders,
    ...sendRecieveOffersProviders,
  ],
  exports: [
    ...databaseProviders,
    ...usersProviders,
    ...marketplaceProviders,
    ...accountProviders,
    ...activityProviders,
    ...listingProviders,
    ...tokenProviders,
    ...bidProviders,
    ...paymentProviders,
    ...assetsProviders,
    ...sendRecieveOffersProviders,
  ],
})
export class DatabaseModule {}
