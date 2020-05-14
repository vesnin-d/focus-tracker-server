import mongoose from 'mongoose';

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

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  status?: string;
}

export default mongoose.model<UserDocument>('User', userSchema);
