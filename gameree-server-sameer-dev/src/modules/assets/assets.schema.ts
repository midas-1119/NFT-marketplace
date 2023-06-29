import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import {  MARKETPLACE, USERS } from 'src/constants';
import { IUserDocument } from '../user/user.schema';

export interface IAssetsDocument extends Document {
  nft: String;
  ownerId: IUserDocument;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const AssetsSchema = new mongoose.Schema<IAssetsDocument>(
  {
    nft: { type: mongoose.Schema.Types.ObjectId, ref: MARKETPLACE },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: USERS },
    deletedAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
  },
);
AssetsSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export { AssetsSchema };