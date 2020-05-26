import Task, { TaskDocument } from '../../models/task';
import { getTaskById, getUserById, getTimeRecordsForTask, isAuthenticated, updateTimeRecordById, updateTaskById, getId } from './resolverUtils';

export function addTask(title: string, user: string) {
  const task = new Task({
    title,
    user,
    isCompleted: false
  });

  return task.save();
}

export async function markTaskCompleted(taskId: any) {
  return updateTaskById(taskId, { isCompleted: true });
}

export default {
  RootQuery: {
    task: isAuthenticated((_: any, args: any) => 
      getTaskById(args.id))
  },
  RootMutation: {
    addTask: isAuthenticated((_: any, args: any, context: any) => 
      addTask(args.title, context.userId as any)),
    completeTask: isAuthenticated((_: any, args: any) => 
      markTaskCompleted(args.id))
  },
  Task: {
    id: getId,  
    user: (parent: TaskDocument) => 
      getUserById(parent.user as any),
    timeRecords: (parent: TaskDocument) => 
      getTimeRecordsForTask(parent._id),
  }
};
