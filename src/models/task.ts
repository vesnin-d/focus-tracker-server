import mongoose, { Schema } from 'mongoose';
import { TaskDocument } from '../types';

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    isCompleted: {
      type: Boolean,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

export default mongoose.model<TaskDocument>('Task', taskSchema);