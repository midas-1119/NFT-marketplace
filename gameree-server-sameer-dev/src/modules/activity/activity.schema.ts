import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { MARKETPLACE, USERS } from 'src/constants';
import { IMarketplaceDocument } from '../marketplace/marketplace.schema';
import { IUserDocument } from '../user/user.schema';

export interface IActivityDocument extends Document {
  from: String;
  to: String;
  seller: IUserDocument;
  buyer: IUserDocument;
  nft: IMarketplaceDocument;
  type: String;
  hash: String;
}

const ActivitySchema = new mongoose.Schema<IActivityDocument>(
  {
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    hash: {
      type: String,
    },
    nft: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MARKETPLACE,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USERS,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USERS,
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
  },
);
ActivitySchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export { ActivitySchema };
