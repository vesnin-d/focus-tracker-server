import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface DecodedToken {
  userId: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization') || "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTgzODgzOWIwMTE0NDYzMzc1MGRmMTciLCJlbWFpbCI6IndoaXp6Zmxhc2tAZ21haWwuY29tIiwiaWF0IjoxNTg5NDgwNzgzLCJleHAiOjE1ODk0ODQzODN9.Hgd8Q20MYa1lH7h0Jvm7x5EJrCg84QltAlIyaaj1Ku8";
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
