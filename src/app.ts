import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import mongoose, { Connection } from 'mongoose';
import BaseRouter from './routes/index';
import path from 'path';

dotenv.config();

const createServer = async (): Promise<Express> => {
  try {
    await mongoose.connect(process.env.DB_URL);
    const dbConnection: Connection = mongoose.connection;

    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use(express.static('front'));

    app.use('/api', BaseRouter);
    app.use('/uploads', express.static('uploads'));

    dbConnection.on('error', (error) =>
      console.log(`error in db connection ${error}`)
    );

    return app;
  } catch (error) {
    throw new Error(`Error initializing app: ${error.message}`);
  }
};

export default createServer;
