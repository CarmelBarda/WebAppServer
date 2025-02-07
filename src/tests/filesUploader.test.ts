import request from 'supertest';
import { Express } from 'express';
import mongoose from 'mongoose';
import initApp from '../app';
import { User } from '../models/models';
import fs from 'fs';
import path from 'path';

let app: Express;
let accessToken: string;
let filePath;
let fileBuffer;

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

  await User.deleteMany({ email: userData.email });

  const registerResponse = await request(app)
    .post('/api/auth/register')
    .send(userData);

  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'john.doe@example.com',
    password: 'password123',
  });

  accessToken = loginResponse.body.accessToken;

  filePath = path.join(__dirname, 'testImage.jpg');
  fileBuffer = fs.readFileSync(filePath);
});

describe('File Uploader API', () => {
  it('should upload a file successfully', async () => {
    const filePath = path.join(__dirname, 'testImage.jpg');
    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', `JWT ${accessToken}`)
      .attach('image', fs.readFileSync(filePath), 'testImage.jpg');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('filename');
  });

  it('should return 400 if no file is uploaded', async () => {
    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'No file uploaded');
  });

  it('should return 401 if not authenticated', async () => {
    const response = await request(app)
      .post('/api/upload')
      .attach('file', fileBuffer, 'testfile.txt');

    expect(response.status).toBe(401);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
