import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { Request } from 'express';

import User from '../models/user';
import Timer from '../models/timer';

class ApiError extends Error {
  code: any;

  constructor(msg: string) {
      super(msg);
  }
}

export default {
  createUser: async function({ userInput }: {
    userInput: {
      email: string;
      password: string;
      name?: string;
    }
  }) {
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
      const error = new ApiError('Invalid input.') as any;
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new ApiError('User exists already!');
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
  },
  login: async function({ email, password }: {
    email: string;
    password: string;
  }) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new ApiError('User not found.');
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new ApiError('Password is incorrect.');
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
    return { token: token, userId: user._id.toString() };
  },
  user: async function(args: any, req: Request) {
    if (!req.isAuth) {
      const error = new ApiError('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new ApiError('No user found!');
      error.code = 404;
      throw error;
    }
    return { ...user, _id: user._id.toString() };
  },
  createTimer: async function({ startedAt }: { startedAt: number }) {
    const timer = new Timer({
      startedAt,
      remains: 25 * 60,
      resumedAt: null,
      isRunning: true
    });
    const createdTimer = await timer.save();
    return {
      ...createdTimer,
      _id: createdTimer._id.toString(),
      createdAt: createdTimer.createdAt.toISOString(),
      updatedAt: createdTimer.updatedAt.toISOString()
    };
  },
  timer: async function({ id }: { id: number }, req: Request) {
    if (!req.isAuth) {
      const error = new ApiError('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const timer = await Timer.findById(id);
    if (!timer) {
      const error = new ApiError('No timer found!');
      error.code = 404;
      throw error;
    }
    return {
      ...timer,
      _id: timer._id.toString(),
      createdAt: timer.createdAt.toISOString(),
      updatedAt: timer.updatedAt.toISOString()
    };
  },
  stopTimer: async function({ id }: { id: number }) {
    const timer = await Timer.findById(id);

    if (!timer) {
      const error = new ApiError('No timer found!');
      error.code = 404;
      throw error;
    }

    if (!timer.isRunning) {
      const error = new ApiError('Timer is not running!');
      error.code = 500;
      throw error;
    }

    timer.isRunning = false;
    await timer.save();

    return {
      ...timer,
      _id: timer._id.toString()
    };
  },
  resumeTimer: async function({ id }: { id: number }) {
    const timer = await Timer.findById(id);
    if (!timer) {
      const error = new ApiError('No timer found!');
      error.code = 404;
      throw error;
    }

    if (!timer.isRunning) {
      const error = new ApiError('Timer is not running!');
      error.code = 500;
      throw error;
    }

    timer.isRunning = false;
    await timer.save();

    return {
      ...timer,
      _id: timer._id.toString()
    };
  },
};
