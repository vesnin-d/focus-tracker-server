import TimeRecord, { TimeRecordDocument } from '../../models/timeRecord';
import { getTimeRecordById, getUserById, getTaskById, updateTimeRecordById, isAuthenticated, getId } from './resolverUtils';

export async function addTimeRecord(duration: number, taskId: string, userId: string) {
  const timeRecord = new TimeRecord({
    duration,
    user: userId,
    task: taskId
  });

  return timeRecord.save();
}

export function assignTimeRecordToTask(timeRecordId: string, taskId: string) {  
    return updateTimeRecordById(timeRecordId, { task: taskId });
}

export function updateTimeRecordDuration(timeRecordId: string, duration: number) {  
    return updateTimeRecordById(timeRecordId, { duration });
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
      addTimeRecord(args.duration, args.taskId, context.userId)
    ),
    updateTimeRecordDuration: isAuthenticated((_: any, args: any, context: any) =>
        updateTimeRecordDuration(args.timeRecordId, args.duration)
    ),
  },
  TimeRecord: {
    id: getId,
    user: (parent: TimeRecordDocument) =>
        getUserById(parent.user as any),
    task: (parent: TimeRecordDocument) => {
        return parent.task ? getTaskById(parent.task as any) : null;
    }
  }
};