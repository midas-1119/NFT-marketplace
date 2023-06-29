import { Connection } from 'mongoose';
import { BID, BID_REPOSITORY, LISTING, LISTING_REPOSITORY, MARKETPLACE, MARKETPLACE_REPOSITORY, TOKEN, TOKEN_REPOSITORY } from 'src/constants';
import { BidSchema } from './bids.schema';
import { ListingSchema } from './listings.schema';
import { MarketplaceSchema } from './marketplace.schema';
import { TokenSchema } from './tokens.schema';

export const marketplaceProviders = [
  {
    provide: MARKETPLACE_REPOSITORY,
    useFactory: (connection: Connection) => connection.model(MARKETPLACE, MarketplaceSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
export const tokenProviders = [
  {
    provide: TOKEN_REPOSITORY,
    useFactory: (connection: Connection) => connection.model(TOKEN, TokenSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
export const listingProviders = [
  {
    provide: LISTING_REPOSITORY,
    useFactory: (connection: Connection) => connection.model(LISTING, ListingSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
export const bidProviders = [
  {
    provide: BID_REPOSITORY,
    useFactory: (connection: Connection) => connection.model(BID, BidSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];