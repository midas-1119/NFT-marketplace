import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { ACCOUNT } from 'src/constants';
import { IAccountDocument } from '../account/account.schema';

export interface IUserDocument extends Document {
  fullName: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  accountId: IAccountDocument;
  isActive: boolean;
  isVerified: boolean;
  isMetamaskUser: boolean;
  roles: Array<string>;
  emailVerificationHash: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  lastLoginAt: Date;
  twoFactorAuthenticationSecret: string;
  isTwoFactorAuthenticationEnabled: boolean;
}

const UserSchema = new mongoose.Schema<IUserDocument>(
  {
    fullName: {
      type: String,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    emailVerificationHash: { type: String },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: ACCOUNT },
    password: { type: String, select: false },
    avatar: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isMetamaskUser: {
      type: Boolean,
      default: false,
    },
    roles: [
      {
        type: String,
        required: true,
      },
    ],
    twoFactorAuthenticationSecret: {
      type: String,
    },
    isTwoFactorAuthenticationEnabled: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date(Date.now()) },
    updatedAt: { type: Date, default: new Date(Date.now()) },
    deletedAt: Date,
    lastLoginAt: Date,
  },
  {
    toJSON: {
      versionKey: false,
    },
  },
);
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export { UserSchema };

export interface IForgetPasswordDocument extends Document {
  email: string;
  pin: Number;
  isVerified: boolean;
  // readonly createdAt: Date;
}

export const ForgetPasswordSchema = new mongoose.Schema(
  {
    email: String,
    pin: {
      type: Number,
      required: true,
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);
