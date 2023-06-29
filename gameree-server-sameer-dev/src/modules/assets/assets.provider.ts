import { Connection } from 'mongoose';
import { ASSETS, ASSETS_REPOSITORY } from 'src/constants';
import { AssetsSchema } from './assets.schema';

export const assetsProviders = [
  {
    provide: ASSETS_REPOSITORY,
    useFactory: (connection: Connection) => connection.model(ASSETS, AssetsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];