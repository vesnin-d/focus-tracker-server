const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Timer = require('../models/timer');
const { clearImage } = require('../util/file');

module.exports = {
  createUser: async function({ userInput }, req) {
    const email = args.userInput.email;
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
      const error = new Error('Invalid input.');
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
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  login: async function({ email, password }) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('User not found.');
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Password is incorrect.');
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
  user: async function(args, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('No user found!');
      error.code = 404;
      throw error;
    }
    return { ...user._doc, _id: user._id.toString() };
  },
  createTimer: async function({ startedAt }, req) {
    const timer = new Timer({
      startedAt,
      remains: 25 * 60,
      resumedAt: null,
      isRunning: true
    });
    const createdTimer = await timer.save();
    return {
      ...createdTimer._doc,
      _id: createdTimer._id.toString(),
      createdAt: createdTimer.createdAt.toISOString(),
      updatedAt: createdTimer.updatedAt.toISOString()
    };
  },
  timer: async function({ id }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const timer = await Timer.findById(id);
    if (!timer) {
      const error = new Error('No timer found!');
      error.code = 404;
      throw error;
    }
    return {
      ...timer._doc,
      _id: timer._id.toString(),
      createdAt: timer.createdAt.toISOString(),
      updatedAt: timer.updatedAt.toISOString()
    };
  },
  stopTimer: async function({ id }, req) {
    const timer = await Timer.findById(id);
    if (!timer) {
      const error = new Error('No timer found!');
      error.code = 404;
      throw error;
    }

    if (!timer.isRunning) {
      const error = new Error('Timer is not running!');
      error.code = 500;
      throw error;
    }

    timer.isRunning = false;
    await timer.save();

    return {
      ...timer._doc,
      _id: timer._id.toString()
    };
  },
  resumeTimer: async function({ id }, req) {
    const timer = await Timer.findById(id);
    if (!timer) {
      const error = new Error('No timer found!');
      error.code = 404;
      throw error;
    }

    if (!timer.isRunning) {
      const error = new Error('Timer is not running!');
      error.code = 500;
      throw error;
    }

    timer.isRunning = false;
    await timer.save();

    return {
      ...timer._doc,
      _id: timer._id.toString()
    };
  },
};
