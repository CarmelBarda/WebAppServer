import request from 'supertest';
import { Express } from 'express';
import mongoose from 'mongoose';
import initApp from '../app';

const generateObjectId = () => new mongoose.Types.ObjectId();

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

describe('GeminiController', () => {
  it('should send a prompt and get text response', async () => {
    const response = await request(app)
      .get(`/api/gemini`)
      .send({ prompt: 'What is the capital of France?' })
      .set('Authorization', `JWT ${accessToken}`)
      .expect(200);

    expect(response.text).toContain('Paris');
  });

  it('should fail when no prompt sent', async () => {
    const response = await request(app)
      .get(`/api/gemini`)
      .set('Authorization', `JWT ${accessToken}`)
      .expect(500);

    expect(response.body).toHaveProperty('message', 'Gemini Request Failed.');
  });
});
