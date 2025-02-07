import request from 'supertest';
import { Express } from 'express';
import mongoose from 'mongoose';
import initApp from '../app';
import { User, Post, Like } from '../models/models';

let app: Express;
let accessToken: string;
let ownerId: string;
let createdPostId: string;

const userData = {
  _id: new mongoose.Types.ObjectId(),
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  refrwshTokens: [],
};

const postData = {
  _id: new mongoose.Types.ObjectId(),
  owner: userData._id,
  title: 'Test Post',
  review: 'This is a test post.',
  rate: 4,
};

const secPostData = {
  _id: new mongoose.Types.ObjectId(),
  owner: userData._id,
  title: 'Test Post 2',
  review: 'This is a test post number two.',
  rate: 4,
};

beforeAll(async () => {
  jest.setTimeout(10000);
  app = await initApp();

  await Post.deleteMany({ owner: postData.owner });
  await Like.deleteMany({ postId: postData._id });
  await Like.deleteMany({ postId: secPostData._id });
  await User.deleteMany({ email: userData.email });

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
  await Post.findByIdAndDelete(createdPostId);
  await User.findByIdAndDelete(ownerId);

  // Close the MongoDB connection
  await mongoose.connection.close();
});

describe('LikeController', () => {
  describe('addLike', () => {
    it('should add a new like', async () => {
      const newLike = {
        userId: String(userData._id),
        postId: String(postData._id),
      };

      const response = await request(app)
        .post(`/api/like`)
        .send(newLike)
        .set('Authorization', `JWT ${accessToken}`)
        .expect(200);

      expect(response.body.userId).toBe(newLike.userId);
      expect(response.body.postId).toBe(newLike.postId);
      expect(response.status).toBe(200);
    });

    it('should return 500 when encountering internal server error while adding a like', async () => {
      jest.spyOn(Like, 'create').mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      const likeData = {
        userId: userData._id,
        postId: secPostData._id,
      };

      const response = await request(app)
        .post(`/api/like`)
        .send(likeData)
        .set('Authorization', `JWT ${accessToken}`)
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Internal Server Error');
    });
  });

  it('should get likes of a post', async () => {
    const response = await request(app)
      .get(`/api/like/${postData._id}`)
      .set('Authorization', `JWT ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return 500 when encountering internal server error while gettting likes of a post', async () => {
    jest.spyOn(Like, 'find').mockImplementation(() => {
      throw new Error('Internal Server Error');
    });

    const response = await request(app)
      .get(`/api/like/${postData._id}`)
      .set('Authorization', `JWT ${accessToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Internal Server Error');
  });

  describe('deleteLike', () => {
    it('should delete a like', async () => {
      const response = await request(app)
        .delete(`/api/like/${postData._id}/${userData._id}`)
        .set('Authorization', `JWT ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Like deleted');
    });

    it('should return 500 when encountering internal server error while deleting a like', async () => {
      jest.spyOn(Like, 'deleteOne').mockImplementationOnce(() => {
        throw new Error('Internal Server Error');
      });

      const response = await request(app)
        .delete(`/api/like/${postData._id}/${userData._id}`)
        .set('Authorization', `JWT ${accessToken}`)
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Internal Server Error');
    });
  });
});
