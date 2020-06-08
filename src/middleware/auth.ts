import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { DEFAULT_TOKEN } from '../utils/constants';

export interface DecodedToken {
  userId: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.APP_SECRET || DEFAULT_TOKEN) as DecodedToken;
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
};

export default authMiddleware;
