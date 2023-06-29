import { Connection } from 'mongoose';
import {
  SEND_RECIEVE_OFFERS,
  SEND_RECIEVE_OFFERS_REPOSITORY,
} from 'src/constants';

import { SendRecieveOffersSchema } from './sendRecieveOffers.schema';

export const sendRecieveOffersProviders = [
  {
    provide: SEND_RECIEVE_OFFERS_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.model(SEND_RECIEVE_OFFERS, SendRecieveOffersSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
