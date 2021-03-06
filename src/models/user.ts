import mongoose from 'mongoose';
import { UserDocument } from '../types';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'I am new!'
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post'
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model<UserDocument>('User', userSchema);
