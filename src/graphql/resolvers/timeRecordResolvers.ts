import { Request } from 'express';
import TimeRecord, { TimeRecordDocument } from '../../models/timeRecord';
import { getTimeRecordById, getUserById, getTaskById, updateTimeRecordById } from './resolverUtils';
import { Schema } from 'mongoose';

export async function addTimeRecord(duration: number, userId: Schema.Types.ObjectId) {
  const timeRecord = new TimeRecord({
    duration,
    user: userId,
    task: null
  });

  const createdTimer = await timeRecord.save();

  return createdTimer._doc;
}

export function assignTimeRecordToTask(timeRecordId: string, taskId: string) {  
  return updateTimeRecordById(timeRecordId, { task: taskId });
}

export default {
  RootQuery: {
    timeRecord: (_: any, args: any) => {
      return getTimeRecordById(args.id);
    }
  }, 
  RootMutation: {
    assignTimeRecordToTask: (_: any, args: any) => {
      return assignTimeRecordToTask(args.timeRecordId, args.taskId);
    },
    addTimeRecord: (_: any, args: any, req: Request) => {
      return addTimeRecord(args.duration, req.userId as any);
    }
  },
  TimeRecord: {
    user: (parent: TimeRecordDocument) => {
      return getUserById(parent.user);
    },
    task: (parent: TimeRecordDocument) => {
      console.log(parent);
      return parent.task ? getTaskById(parent.task) : null;
    }
  }
};