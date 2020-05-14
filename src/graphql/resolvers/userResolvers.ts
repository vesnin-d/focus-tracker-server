import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import User, { UserDocument } from '../../models/user';
import { getUserById, getTimeRecordsForUser, getTasksForUser, isAuthenticated } from './resolverUtils';

export interface UserCreationData {
    email: string;
    password: string;
    name?: string;
}

export async function createUser(userInput: UserCreationData) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
        errors.push({ message: 'E-Mail is invalid.' });
    }
    if (
        validator.isEmpty(userInput.password) ||
        !validator.isLength(userInput.password, { min: 5 })
    ) {
        errors.push({ message: 'Password too short!' });
    }
    if (errors.length > 0) {
        const error = new Error('Invalid input.') as any;
        error.data = errors;
        error.code = 422;
        throw error;
    }
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
        const error = new Error('User exists already!');
        throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
        email: userInput.email,
        name: userInput.name,
        password: hashedPw
    });
    const createdUser = await user.save();
    return { ...createdUser, _id: createdUser._id.toString() };
}

export async function login(email: string, password: string) {
    const user = await User.findOne({ email: email });
    if (!user) {
        const error = new Error('User not found.') as any;
        error.code = 401;
        throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Password is incorrect.') as any;
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email
      },
      'iwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0a',
      { expiresIn: '1h' }
    );

    return { 
        token: token, 
        userId: user._id.toString() 
    };
}

export default {
    RootQuery: {
        login: (_: any, args: any) => 
            login(args.email, args.password),
        user: isAuthenticated((_: any, args: any, context: any) => 
            getUserById(context.userId as any))
    },
    RootMutation: {
        createUser: (_: any, args: any) => 
            createUser(args.userInput)
    },
    User: {
        timeRecords: (parent: UserDocument) =>
            getTimeRecordsForUser(parent._id),
        tasks: (parent: UserDocument) =>
            getTasksForUser(parent._id),
    }
};