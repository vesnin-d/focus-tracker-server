import mongoose, { Schema } from 'mongoose';

export interface TaskDocument extends mongoose.Document {
  title: string;
  user: Schema.Types.ObjectId;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  _doc: any;
}

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