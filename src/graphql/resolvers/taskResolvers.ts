import Task, { TaskDocument } from '../../models/task';
import { getTaskById, getUserById, getTimeRecordsForTask, isAuthenticated } from './resolverUtils';

export async function addTask( title: string, user: string) {
  const task = new Task({
    title,
    user
  });

  return await task.save();
}

export default {
  RootQuery: {
    task: isAuthenticated((_: any, args: any) => 
      getTaskById(args.id))
  },
  RootMutation: {
    addTask: isAuthenticated((_: any, args: any, context: any) => 
      addTask(args.title, context.userId as any))
  },
  Task: {
    user: (parent: TaskDocument) => 
      getUserById(parent.user),
    timeRecords: (parent: TaskDocument) => 
      getTimeRecordsForTask(parent._id),
  }
};
