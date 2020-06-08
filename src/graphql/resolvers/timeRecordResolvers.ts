import { 
    getTimeRecordById, 
    getUserById,
    getTaskById, 
    updateTimeRecordById, 
    isAuthenticated, 
    getId, 
    createTimeRecord 
} from './resolverUtils';
import { 
    RootQueryTimeRecordArgs, 
    RootMutationAssignTimeRecordToTaskArgs, 
    RootMutationAddTimeRecordArgs, 
    RootMutationUpdateTimeRecordDurationArgs 
} from '../generated';
import { TimeRecordDocument } from '../../types';

export function addTimeRecord(duration: number, userId: string, taskId?: string | null) {
  return createTimeRecord({
    duration,
    user: userId,
    task: taskId
  });
}

export function assignTimeRecordToTask(timeRecordId: string, taskId: string) {  
    return updateTimeRecordById(timeRecordId, { task: taskId });
}

export function updateTimeRecordDuration(timeRecordId: string, duration: number) {  
    return updateTimeRecordById(timeRecordId, { duration });
}

export default {
  RootQuery: {
    timeRecord: isAuthenticated((_: void, args: RootQueryTimeRecordArgs) =>
      getTimeRecordById(args.id))
  }, 
  RootMutation: {
    assignTimeRecordToTask: isAuthenticated((
        _: void, 
        args: RootMutationAssignTimeRecordToTaskArgs
    ) =>
      assignTimeRecordToTask(args.timeRecordId, args.taskId)
    ),
    addTimeRecord: isAuthenticated((
        _: void, 
        args: RootMutationAddTimeRecordArgs, 
        context: Express.Request
    ) =>
      addTimeRecord(args.duration, context.userId!, args.taskId)
    ),
    updateTimeRecordDuration: isAuthenticated((
        _: void, 
        args: RootMutationUpdateTimeRecordDurationArgs
    ) =>
        updateTimeRecordDuration(args.timeRecordId, args.newDuration)
    ),
  },
  TimeRecord: {
    id: getId,
    user: (parent: TimeRecordDocument) =>
        getUserById(parent.user),
    task: (parent: TimeRecordDocument) => {
        return parent.task ? getTaskById(parent.task) : null;
    }
  }
};
