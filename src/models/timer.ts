import mongoose from 'mongoose';

export interface TimerDocument extends mongoose.Document {
  remains: number;
  resumedAt: number;
  startedAt: number;
  isRunning: boolean;
  createdAt: Date;
  updatedAt: Date;
  _doc: any;
}

const Schema = mongoose.Schema;

const timerSchema = new Schema(
  {
    remains: {
      type: Number,
      required: true
    },
    resumedAt: {
        type: Number
    },
    startedAt: {
        type: Number,
        required: true
    },
    isRunning: {
      type: Boolean,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<TimerDocument>('Timer', timerSchema);
