import request from 'supertest';
import { Express } from 'express';
import mongoose from 'mongoose';
import initApp from '../app';
import path from 'path';
import * as uploadController from '../controllers/filesUploader.controller';
import multer from 'multer';
import fs from 'fs';
let app: Express;
let accessToken: string;
let ownerId: string;

const userData = {
  _id: new mongoose.Types.ObjectId(),
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  refrwshTokens: [],
};

beforeAll(async () => {
  jest.setTimeout(10000);
  app = await initApp();

  const registerResponse = await request(app)
    .post('/api/auth/register')
    .send(userData);
  ownerId = registerResponse.body._id;

  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'john.doe@example.com',
    password: 'password123',
  });

  accessToken = loginResponse.body.accessToken;
});

afterAll(async () => {
  // Close the MongoDB connection
  await mongoose.connection.close();
});

describe('uploadImage', () => {
  it('should upload a file', async () => {
    const filePath = path.join(__dirname, 'testImage.jpg');

    try {
      const response = await request(app)
        .post('/api/upload')
        .attach('file', filePath);
      expect(response.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
      expect(1).toEqual(2);
    }

    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', `JWT ${accessToken}`)
      .set('Content-Type', 'multipart/form-data')
      .attach('file', filePath)
      .expect(200);

    expect(response.body).toHaveProperty('filename');
  });

  it('should return 400 when no file is uploaded', async () => {
    const response = await request(app)
      .post('/api/upload')
      .send()
      .set('Authorization', `JWT ${accessToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'No file uploaded');
  });

  it('should return 500 when encountering internal server error while uploading a file', async () => {
    jest.spyOn(uploadController, 'uploadImage').mockImplementation(async () => {
      throw new Error('Internal Server Error');
    });

    const response = await request(app)
      .post('/api/upload')
      .attach('file', path.join(__dirname, 'testImage.jpg'))
      .set('Authorization', `JWT ${accessToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Internal Server Error');
  });
});
