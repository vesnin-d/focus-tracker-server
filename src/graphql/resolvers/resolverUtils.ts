import { Schema } from 'mongoose';
import TimeRecord from '../../models/timeRecord';
import Task from '../../models/task';
import User from '../../models/user';

export async function getTimeRecordById(id: string) {
    const timeRecord = await TimeRecord.findById(id);
    return timeRecord?._doc
}

export async function getTimeRecordsForUser(userId: string) {
    const timeRecords = await TimeRecord.find({ user: userId as any });
    return timeRecords.map(timeRecord => timeRecord._doc);
}

export function getTimeRecordsForTask(taskId: string) {
    return TimeRecord.find({ task: taskId as any });
}

export async function updateTimeRecordById(id: string, fields: any) {
    return await TimeRecord.findByIdAndUpdate(id, fields, { new: true});
}

type TaskTimeFrame = 'DAY' | 'WEEK' | 'MONTH';

export async function getTasksForUser(
    userId: Schema.Types.ObjectId, 
    completed: boolean, 
    timeFrame: TaskTimeFrame
) {
    const today = new Date();
    let queryDate = new Date();
    queryDate.setDate(today.getDate() - 1);

    if (timeFrame === 'MONTH') {
        queryDate.setMonth(today.getMonth() - 1);
    } else if(timeFrame === 'WEEK') {
        queryDate.setDate(today.getDate() - 7);
    }

    return Task.find({
        user: userId,
        isCompleted: completed,
        createdAt: { $gte: queryDate }
    });
}

export async function getUserById(id: string) {
    return await User.findById(id);
}

export async function getTaskById(id: string) {
    return await Task.findById(id);
}

export async function updateTaskById(id: string, fields: any) {
    return await Task.findByIdAndUpdate(id, fields, { new: true});
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
