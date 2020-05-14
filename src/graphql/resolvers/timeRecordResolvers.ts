import { Request } from 'express';
import TimeRecord, { TimeRecordDocument } from '../../models/timeRecord';
import { getTimeRecordById, getUserById, getTaskById, updateTimeRecordById, isAuthenticated } from './resolverUtils';
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
    timeRecord: isAuthenticated((_: any, args: any) =>
      getTimeRecordById(args.id))
  }, 
  RootMutation: {
    assignTimeRecordToTask: isAuthenticated((_: any, args: any) =>
      assignTimeRecordToTask(args.timeRecordId, args.taskId)
    ),
    addTimeRecord: isAuthenticated((_: any, args: any, context: any) =>
      addTimeRecord(args.duration, context.userId as any)
    )
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