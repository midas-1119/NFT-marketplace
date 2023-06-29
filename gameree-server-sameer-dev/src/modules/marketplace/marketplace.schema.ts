import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { USERS } from 'src/constants';
import { IUserDocument } from '../user/user.schema';
import { IListingDocument } from '../marketplace/listings.schema';

interface ILocation {
  lng: Number;
  lat: Number;
}
export interface IMarketplaceDocument extends Document {
  address: String;
  id: String;
  tokenId: Number;
  royalty: Number;
  area: Number;
  geometry: any;
  incAddress: any;
  sequence: Number;
  location: ILocation;
  price: Number;
  image: String;
  ownerId: IUserDocument;
  ownerAddress: String;
  creatorAddress: String;
  status: String;
  listingId: String;
  listing: IListingDocument;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  type: number;
}

const MarketplaceSchema = new mongoose.Schema<IMarketplaceDocument>(
  {
    address: { type: String, required: true },
    id: { type: String },
    tokenId: { type: Number },
    royalty: { type: Number },
    type: { type: Number },
    area: { type: Number, required: true },
    incAddress: { type: Object, required: true },
    geometry: { type: Object, required: true },
    location: { type: Object, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    sequence: { type: Number },
    status: { type: String },
    listingId: { type: String },
    listing: { type: Object },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: USERS },
    ownerAddress: { type: String, required: false },
    creatorAddress: { type: String, required: false },
    deletedAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
  },
);
MarketplaceSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export { MarketplaceSchema };
