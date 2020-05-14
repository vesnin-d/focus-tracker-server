import { Schema } from 'mongoose';
import TimeRecord from '../../models/timeRecord';
import Task from '../../models/task';
import User from '../../models/user';

export async function getTimeRecordById(id: string) {
    const timeRecord = await TimeRecord.findById(id);
    return timeRecord?._doc
}

export async function getTimeRecordsForUser(userId: Schema.Types.ObjectId) {
    const timeRecords = await TimeRecord.find({ user: userId });
    return timeRecords.map(timeRecord => timeRecord._doc);
}

export function getTimeRecordsForTask(taskId: Schema.Types.ObjectId) {
    return TimeRecord.find({ task: taskId });
}

export async function updateTimeRecordById(id: string, fields: any) {
    return await TimeRecord.findByIdAndUpdate(id, fields, { new: true});
}

export async function getTasksForUser(userId: Schema.Types.ObjectId) {
    const tasks = await Task.find({ user: userId });
    return tasks.map(task => task._doc);
}

export async function getUserById(id: Schema.Types.ObjectId) {
    return await User.findById(id);
}

export async function getTaskById(id: Schema.Types.ObjectId) {
    return await Task.findById(id);
}
