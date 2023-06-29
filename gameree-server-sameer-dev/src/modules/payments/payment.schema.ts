import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import {  USERS } from 'src/constants';
import { IUserDocument } from '../user/user.schema';

export interface IPaymentDocument extends Document {
  amount: number;
  currency: string;
  paymentId: string;
  metadata: any;
  billing_details: any;
  payment_intent: string;
  receipt_url: string;
  boughtBy: IUserDocument;
  deletedAt: Date;
}

const PaymentSchema = new mongoose.Schema<IPaymentDocument>(
  {
    amount: { type: Number, default: 0 },
    currency: { type: String },
    metadata: { type: Object },
    billing_details: { type: Object },
    payment_intent: { type: String },
    receipt_url: { type: String },
    paymentId: {
      type: String
    },
    boughtBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USERS
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
    
  },
);

PaymentSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export { PaymentSchema };
