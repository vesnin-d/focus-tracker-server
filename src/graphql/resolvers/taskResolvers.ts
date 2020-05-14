import { Request } from 'express';
import Task, { TaskDocument } from '../../models/task';
import { getTaskById, getUserById, getTimeRecordsForTask } from './resolverUtils';

export async function addTask( title: string, user: string) {
  const task = new Task({
    title,
    user
  });

  return await task.save();
}

export default {
  RootQuery: {
    task: (_: any, args: any) => 
      getTaskById(args.id)
  },
  RootMutation: {
    addTask: (_: any, args: any, req: Request) => 
      addTask(args.title, req.userId as any)
  },
  Task: {
    user: (parent: TaskDocument) => 
      getUserById(parent.user),
    timeRecords: (parent: TaskDocument) => 
      getTimeRecordsForTask(parent._id),
  }
};
