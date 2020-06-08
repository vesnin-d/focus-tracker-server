import mongoose, { Schema } from 'mongoose';
import { TimeRecordDocument } from '../types';

const timeRecordSchema = new Schema({
    status: {
        type: String
    },
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
