import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import graphqlHttp from 'express-graphql';
import { GraphQLError } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { importSchema } from 'graphql-import';
import jwt from 'jsonwebtoken';
import graphqlResolver from './graphql/resolvers/index';
import auth from './middleware/auth';

const app = express();

const port = process.env.PORT || 8080;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/focustracker';

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);

app.use(
  '/graphql',
  graphqlHttp({
    schema: makeExecutableSchema({
      typeDefs: importSchema('./src/graphql/schema.graphql'),
      resolvers: graphqlResolver
    }),
    graphiql: true,
    // ,
    // customFormatErrorFn(err: GraphQLError) {
    //   console.log(err, err.originalError);
    //   if (!err.originalError) {
    //     return err;
    //   }
    //   const data = (err.originalError as any).data;
    //   const message = err.message || 'An error occurred.';
    //   const code = (err.originalError as any).code || 500;
    //   return { message: message, status: code, data: data };
    // }
  })
);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    mongoUri
  )
  .then(result => {
    app.listen(port);
  })
  .catch(err => console.log(err));
