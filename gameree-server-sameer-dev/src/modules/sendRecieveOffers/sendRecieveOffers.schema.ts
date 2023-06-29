import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { MARKETPLACE } from 'src/constants';
import { IMarketplaceDocument } from '../marketplace/marketplace.schema';
import { USERS } from 'src/constants';
import { IUserDocument } from '../user/user.schema';

export interface ISendRecieveOffersDocument extends Document {
  from: IUserDocument;
  to: IUserDocument;
  status: String;
  price: Number;
  nft: IMarketplaceDocument;
  listingId: String;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const SendRecieveOffersSchema = new mongoose.Schema<ISendRecieveOffersDocument>(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: USERS, required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: USERS, required: true },
    status: { type: String, required: true },
    price: { type: Number, required: true },
    nft: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MARKETPLACE,
      required: true,
    },
    listingId: { type: String, required: true },
    deletedAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
  },
);
SendRecieveOffersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export { SendRecieveOffersSchema };
