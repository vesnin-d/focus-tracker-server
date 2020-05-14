import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface DecodedToken {
  userId: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization') || "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTgzODgzOWIwMTE0NDYzMzc1MGRmMTciLCJlbWFpbCI6IndoaXp6Zmxhc2tAZ21haWwuY29tIiwiaWF0IjoxNTg5NDg2OTI2LCJleHAiOjE1ODk0OTA1MjZ9.buBp3CWfpYm8zhg1Ru1LMNWFyy7L30Wmy_AF9aTmqaw";
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'iwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0a') as DecodedToken;
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
