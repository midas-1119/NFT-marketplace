import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

interface ILocation {
  lng: Number;
  lat: Number;
}
export interface ITokenDocument extends Document {
  status: String;
  id: String;
  name: String;
  chain: String;
  chainId: Number;
  contract: String;
  transactionHash: String;
  contractAddress: String;
  creater: String;
  owner: String;
  uri: String;
  tokenId: String;
  image: String;
  description: String;
  imageHash: String;
  edition: Number
  date: Date
  fileType: String;
  properties: any;
  attributes: any;
  categories: any;
  collectionId: String;
  area: Number;
  geometry: any;
  incAddress: any;
  sequence: Number;
  location: ILocation;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const TokenSchema = new mongoose.Schema<ITokenDocument>(
  {
    status: { type: String},
    id: { type: String},
    name: { type: String},
    chain: { type: String},
    chainId:  { type: Number},
    contract: { type: String},
    transactionHash: { type: String},
    contractAddress: { type: String},
    creater: { type: String},
    owner: { type: String},
    uri: { type: String},
    tokenId: { type: String},
    image: { type: String},
    description: { type: String},
    imageHash: { type: String},
    edition:  { type: Number},
    fileType: { type: String},
    properties:  { type: Object},
    attributes:  { type: Object},
    categories:  { type: Object},
    collectionId: { type: String},
    area: { type: Number, required: true},
    incAddress: { type: Object, required: true},
    geometry: { type: Object, required: true},
    location: { type: Object, required: true},
    sequence: { type: Number },
    date:  Date,
    deletedAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
  },
);
TokenSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export { TokenSchema };