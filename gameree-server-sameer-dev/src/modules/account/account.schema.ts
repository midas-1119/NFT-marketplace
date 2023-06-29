import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export interface IAccountDocument extends Document {
  address: String;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const AccountSchema = new mongoose.Schema<IAccountDocument>(
  {
    address: { type: String, required: true, unique: true},
    deletedAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
  },
);
AccountSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export { AccountSchema };