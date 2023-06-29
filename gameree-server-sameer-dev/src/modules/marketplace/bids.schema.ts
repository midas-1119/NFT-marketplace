import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { USERS } from 'src/constants';
import { IUserDocument } from '../user/user.schema';
import { LISTING } from 'src/constants';
import { IListingDocument } from '../marketplace/listings.schema';

export interface IBidDocument extends Document {
  // status: String;
  // chain: String;
  // currency: String;
  // chainId: Number;
  // contract: String;
  // contractAddress: String;
  transactionHash: String;
  bidder: IUserDocument;
  biddingId: String;
  // listingId: String;
  listing: IListingDocument;
  price: Number;
  isActive: Boolean;
  isWin: Boolean;
  isClaimed: Boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const BidSchema = new mongoose.Schema<IBidDocument>(
  {
    // status: { type: String },
    // currency: { type: String },
    // chain: { type: String },
    // chainId: { type: Number },
    // contract: { type: String },
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USERS,
      required: true,
    },
    biddingId: { type: String, required: true },
    transactionHash: { type: String },
    // listingId: { type: String },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: LISTING,
      required: true,
    },
    // contractAddress: { type: String },
    price: { type: Number },
    isActive: { type: Boolean },
    isWin: { type: Boolean },
    isClaimed: { type: Boolean },
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
  },
);
BidSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export { BidSchema };
