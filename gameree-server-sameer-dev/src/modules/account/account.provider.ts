import { Connection } from 'mongoose';
import { ACCOUNT, ACCOUNT_REPOSITORY } from 'src/constants';
import { AccountSchema } from './account.schema';

export const accountProviders = [
  {
    provide: ACCOUNT_REPOSITORY,
    useFactory: (connection: Connection) => connection.model(ACCOUNT, AccountSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
