import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export interface INewsletterDocument extends Document {
  email: string;
  deletedAt: Date;
}

const NewsletterSchema = new mongoose.Schema<INewsletterDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true
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

NewsletterSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export { NewsletterSchema };
