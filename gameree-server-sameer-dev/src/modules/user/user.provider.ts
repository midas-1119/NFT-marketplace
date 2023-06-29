import { Connection } from 'mongoose';
import { FORGET_PASSWORD, FORGET_PASSWORD_REPOSITORY, NEWSLETTER, NEWSLETTER_REPOSITORY, USERS, USER_REPOSITORY} from 'src/constants';
import { NewsletterSchema } from '../newsletter/newsletter.schema';
import { ForgetPasswordSchema, UserSchema } from './user.schema';

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (connection: Connection) => connection.model(USERS, UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: FORGET_PASSWORD_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.model(FORGET_PASSWORD, ForgetPasswordSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: NEWSLETTER_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.model(NEWSLETTER, NewsletterSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];