import { Connection } from 'mongoose';
import { PAYMENTS, PAYMENTS_REPOSITORY } from 'src/constants';
import { PaymentSchema } from './payment.schema';

export const paymentProviders = [
  {
    provide: PAYMENTS_REPOSITORY,
    useFactory: (connection: Connection) => connection.model(PAYMENTS, PaymentSchema),
    inject: ['DATABASE_CONNECTION'],
  }
];
