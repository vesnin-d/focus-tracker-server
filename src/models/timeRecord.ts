import mongoose, { Schema } from 'mongoose';

export interface TimeRecordDocument extends mongoose.Document {
  duration: number;
  user: Schema.Types.ObjectId;
  task: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  _doc: any;
}

const timeRecordSchema = new Schema(
  {
    duration: {
      type: Number,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task'
    }
  },
  { timestamps: true }
);

export default mongoose.model<TimeRecordDocument>('TimeRecord', timeRecordSchema);
