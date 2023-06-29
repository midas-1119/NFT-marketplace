import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { MARKETPLACE } from 'src/constants';
import { BID } from 'src/constants';
import { IBidDocument } from './bids.schema';
import { ITokenDocument } from './tokens.schema';

export interface IListingDocument extends Document {
  // name: String;
  // status: String;
  // currency: String;
  // chain: String;
  // chainId: Number;
  nft: ITokenDocument;
  // contract: String;
  timestamp: Date;
  // blockHash: Number;
  // blockNumber: Number;
  transactionHash: String;
  // transactionIndex: Number;
  from: String;
  // to: String;
  // logIndex: Number;
  listingId: String;
  highestBiddingId: IBidDocument;
  // sender: String;
  // hostContract: String;
  // tokenId: String;
  sellMode: String;
  price: Number;
  startTime: String;
  duration: String;
  endTime: String;
  soldTo: String;
  isActive: Boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const ListingSchema = new mongoose.Schema<IListingDocument>(
  {
    // name: { type: String },
    // status: { type: String },
    // currency: { type: String },
    // chain: { type: String },
    // chainId: { type: Number },
    nft: { type: mongoose.Schema.Types.ObjectId, ref: MARKETPLACE },
    // contract: { type: String },
    // blockHash: { type: Number },
    // blockNumber: { type: Number },
    transactionHash: { type: String },
    // transactionIndex: { type: Number },
    from: { type: String },
    // to: { type: String },
    // logIndex: { type: Number },
    listingId: { type: String },
    highestBiddingId: { type: mongoose.Schema.Types.ObjectId, ref: BID },
    // sender: { type: String },
    // hostContract: { type: String },
    // tokenId: { type: String },
    sellMode: { type: String },
    price: { type: Number },
    startTime: { type: String },
    duration: { type: String },
    soldTo: { type: String },
    isActive: { type: Boolean },
    endTime: { type: String },
    timestamp: Date,
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
ListingSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export { ListingSchema };
