import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import User from '../../models/user';

export interface UserCreationData {
    userInput: {
        email: string;
        password: string;
        name?: string;
    }
}

export async function createUser({ userInput }: UserCreationData) {
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

export async function login({ email, password }: {
    email: string;
    password: string;
}) {
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
  
export async function user(_args: any, req: Request) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!') as any;
      error.code = 401;
      throw error;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('No user found!') as any;
      error.code = 404;
      throw error;
    }

    return { 
        ...user, 
        _id: user._id.toString() 
    };
}