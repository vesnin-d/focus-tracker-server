import { Request } from 'express';
import Timer from '../../models/timer';

export async function createTimer({ startedAt }: { startedAt: number }) {
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
}

export async function timer({ id }: { id: number }, req: Request) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!') as any;
      error.code = 401;
      throw error;
    }
    const timer = await Timer.findById(id);
    if (!timer) {
      const error = new Error('No timer found!') as any;
      error.code = 404;
      throw error;
    }
    return {
      ...timer,
      _id: timer._id.toString(),
      createdAt: timer.createdAt.toISOString(),
      updatedAt: timer.updatedAt.toISOString()
    };
}

export async function stopTimer({ id }: { id: number }) {
    const timer = await Timer.findById(id);

    if (!timer) {
      const error = new Error('No timer found!') as any;
      error.code = 404;
      throw error;
    }

    if (!timer.isRunning) {
      const error = new Error('Timer is not running!') as any;
      error.code = 500;
      throw error;
    }

    timer.isRunning = false;
    await timer.save();

    return {
      ...timer,
      _id: timer._id.toString()
    };
}

export async function resumeTimer({ id }: { id: number }) {
    const timer = await Timer.findById(id);
    if (!timer) {
      const error = new Error('No timer found!') as any;
      error.code = 404;
      throw error;
    }

    if (!timer.isRunning) {
      const error = new Error('Timer is not running!') as any;
      error.code = 500;
      throw error;
    }

    timer.isRunning = false;
    await timer.save();

    return {
      ...timer,
      _id: timer._id.toString()
    };
}
