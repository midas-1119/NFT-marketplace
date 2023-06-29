import { Connection } from 'mongoose';
import { ACTIVITY, ACTIVITY_REPOSITORY} from 'src/constants';
import { ActivitySchema } from './activity.schema';

export const activityProviders = [
  {
    provide: ACTIVITY_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.model(ACTIVITY, ActivitySchema),
    inject: ['DATABASE_CONNECTION'],
  },
];