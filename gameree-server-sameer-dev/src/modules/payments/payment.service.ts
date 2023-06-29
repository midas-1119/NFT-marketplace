import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  PAYMENTS_REPOSITORY,
} from 'src/constants';
import { sharedCrudService } from '../shared/services/sharedCrud.services';
import { IPaymentDocument } from './payment.schema';

@Injectable()
export class PaymentService extends sharedCrudService {
  constructor(
    @Inject(PAYMENTS_REPOSITORY)
    readonly paymentsRepository: Model<IPaymentDocument>,
  ) {
    super(paymentsRepository);
  }

}
