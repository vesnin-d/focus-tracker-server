import { Document } from 'mongoose';

export interface TaskDocument extends Document {
    title: string;
    user: string;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface TimeRecordDocument extends Document {
    duration: number;
    user: string;
    task: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserDocument extends Document {
    email: string;
    password: string;
    name: string;
    status?: string;
}
