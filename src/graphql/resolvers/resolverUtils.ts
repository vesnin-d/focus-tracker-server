import TimeRecord from '../../models/timeRecord';
import Task from '../../models/task';
import User from '../../models/user';
import { TimeFrames } from '../generated';
import { TimeRecordDocument, TaskDocument } from '../../types';

// Time Records
export interface TimeRecordData {
    duration: number;
    user: string;
    task?: string | null
}

export function createTimeRecord(data: TimeRecordData) {
    const timeRecord = new TimeRecord(data);
    return timeRecord.save();
}

export function getTimeRecordById(id: string) {
    return TimeRecord.findById(id);
}

export function getTimeRecordsForUser(userId: string) {
    return TimeRecord.find({ user: userId });
}

export function getTimeRecordsForTask(taskId: string) {
    return TimeRecord.find({ task: taskId });
}

export function updateTimeRecordById(id: string, fields: Partial<Omit<TimeRecordDocument, 'id'>>) {
    return TimeRecord.findByIdAndUpdate(id, fields, { new: true});
}

// Tasks
export function createTask(title: string, user: string) {
    const task = new Task({
        title,
        user,
        isCompleted: false
    });
    return task.save();
}

export function getTaskById(id: string) {
    return Task.findById(id);
}

export function getTasksForUser(
    userId: string, 
    completed: boolean = false, 
    timeFrame: TimeFrames = TimeFrames.Day
) {
    const today = new Date();
    let queryDate = new Date();
    queryDate.setDate(today.getDate() - 1);

    if (timeFrame === TimeFrames.Month) {
        queryDate.setMonth(today.getMonth() - 1);
    } else if(timeFrame === TimeFrames.Week) {
        queryDate.setDate(today.getDate() - 7);
    }

    return Task.find({
        user: userId,
        isCompleted: completed,
        createdAt: { $gte: queryDate }
    });
}

export function updateTaskById(id: string, fields: Partial<Omit<TaskDocument,'id'>>) {
    return Task.findByIdAndUpdate(id, fields, { new: true});
}

// Users
export function getUserById(id: string) {
    return User.findById(id);
}

export function getUserByEmail(email: string) {
    return User.findOne({ email });
}

export function createUser(email: string, password: string, name: string) {
    const user = new User({
        email,
        name,
        password
    });

    return user.save();
}

export function isAuthenticated(next: any) {
    return (root: any, args: any, context: any, info: any) => {
        if(!context.isAuth) {
            const error = new Error('Not authenticated!') as any;	
            error.code = 401;	
            throw error;	
        }

        return next(root, args, context, info);
    };
}

export function getId<T extends { _id: string }>(parent: T) {
    return parent._id;
}
