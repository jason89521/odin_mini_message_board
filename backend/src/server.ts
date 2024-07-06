import express, { Express } from 'express';
import mongoose from 'mongoose';
import messageRouter from './routes/message';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';

export class Server {
  URI: string;
  PORT: string;
  ALLOWED_ORIGINS: string[];
  DB_NAME: string;

  app: Express;

  constructor() {
    const URI = process.env.MONGO_URI;
    const PORT = process.env.PORT;
    const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
    const DB_NAME = process.env.DB_NAME;
    assert(URI, `MongoDB's URI`);
    assert(PORT, 'PORT');
    assert(ALLOWED_ORIGINS, 'Allowed origins');
    assert(DB_NAME, 'DB name');

    this.URI = URI;
    this.PORT = PORT;
    this.ALLOWED_ORIGINS = (() => {
      const arr = JSON.parse(ALLOWED_ORIGINS);
      if (!Array.isArray(arr)) {
        process.exit('ALLOWED_ORIGINS is not an array.');
      }

      return arr;
    })();
    this.DB_NAME = DB_NAME;

    this.app = express();
  }

  async connect() {
    await mongoose.connect(this.URI, { dbName: this.DB_NAME });
    this.app.listen(this.PORT, () => {
      console.log('Start listening.');
    });
  }

  registerHandlers() {
    this.app.use(cors({ origin: this.ALLOWED_ORIGINS }));
    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());

    // routes
    this.app.use(messageRouter);
  }
}

function assert<T>(
  assertion: T | undefined | null,
  name: string
): asserts assertion is NonNullable<T> {
  if (assertion === null || typeof assertion === 'undefined') {
    process.exit(`${name} should be non-nullable`);
  }
}
