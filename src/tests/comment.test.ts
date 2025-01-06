import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import initApp from "../app";
import { User, Post, Comment } from "../models/models";

const generateObjectId = () => new mongoose.Types.ObjectId();

let app: Express;
let accessToken: string;
let ownerId: string;
let postId: string;
let commentId: string;
let commentId2: string;

const userData = {
  _id: new mongoose.Types.ObjectId(),
  name: "John Doe",
  email: "john.doe@example.com",
  password: "password123",
  // refreshTokens: [],
};

const postData = {
  _id: new mongoose.Types.ObjectId(),
  owner: userData._id,
  title: "Test Post",
  content: "This is a test post."
};

beforeAll(async () => {
  app = await initApp();

  await Post.deleteMany({ owner: postData.owner });
  await User.deleteMany({ email: userData.email });

  const response = await request(app).post("/api/auth/register").send(userData);
  ownerId = response.body._id;

  const response2 = await request(app)
    .post("/api/auth/login")
    .send({ email: "john.doe@example.com", password: "password123" });

  const registerResponse = await request(app)
    .post("/api/auth/register")
    .send(userData);
  ownerId = registerResponse.body._id;
  accessToken = response2.body.accessToken;

  const loginResponse = await request(app).post("/api/auth/login").send({
    email: "john.doe@example.com",
    password: "password123",
  });
  accessToken = loginResponse.body.accessToken;

  const postResponse = await request(app)
    .post(`/api/post/`)
    .set("Authorization", `JWT ${accessToken}`)
    .send(postData);

  postId = postResponse.body._id;
});

afterAll(async () => {
  await Post.findByIdAndDelete(postId);
  await Comment.findByIdAndDelete(commentId);

  // Close the MongoDB connection
  await mongoose.connection.close();
});

describe("CommentController", () => {
  describe("addComment", () => {
    it("should add a new comment to a post", async () => {
      const content = {
        message: "This is a test comment.",
        userId: userData._id,
        postId: postData._id
      };

      const response = await request(app)
        .post(`/api/comment`)
        .send(content)
        .set("Authorization", `JWT ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("_id");
      expect(response.body.message).toBe(content.message);
      expect(response.body.postId).toBe(postId);

      commentId = response.body._id;
    });

    it("should add a second new comment to a post", async () => {
      const content = {
        message: "This is a test comment 2",
        userId: userData._id,
        postId: postData._id
      };

      const response = await request(app)
        .post(`/api/comment`)
        .send(content)
        .set("Authorization", `JWT ${accessToken}`)
        .expect(200);

      expect(response.status).toBe(200);

      commentId2 = response.body._id;
    });
    
    it("should return 401 when adding comment without authentication", async () => {
      const content = {
        message: "This comment should not be added.",
        userId: userData._id,
        postId: postData._id
      };

       const response = await request(app)
        .post(`/api/comment`)
        .send(content)


        expect(response.status).toBe(401);
    });

    it("should return 500 when encountering internal server error while adding comment", async () => {
      // Mocking the CommentModel constructor to throw an error when called
      jest.spyOn(Comment.prototype, "save").mockImplementation(() => {
        throw new Error("Internal Server Error");
      });

      const content = {
        message: "This is a test comment.",
        userId: userData._id,
        postId: postData._id
      };

      const response = await request(app)
        .post(`/api/comment`)
        .send(content)
        .set("Authorization", `JWT ${accessToken}`)
        
        
      expect(response.status).toBe(500);

      expect(response.body).toHaveProperty("message", "Internal Server Error");
    });
  });

  describe("deleteComment", () => {
    it("should delete an existing comment", async () => {
      const response = await request(app)
        .delete(`/api/comment/${commentId}`)
        .set("Authorization", `JWT ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "Comment deleted successfully"
      );
    });

    it("should return 404 when deleting non-existing comment", async () => {
      const nonExistingCommentId = generateObjectId();

      const response = await request(app)
        .delete(`/api/comment/${nonExistingCommentId}`)
        .set("Authorization", `JWT ${accessToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("error", "Comment not found");
    });

    it("should return 401 when deleting comment without authentication", async () => {
      await request(app)
        .delete(`/api/comment/${commentId}`)
        .expect(401);
    });

    it("should return 401 when deleting comment without ownership", async () => {
      const otherUserResponse = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Other User",
          email: "other.user@example.com",
          password: "password456",
          type: "student",
        });

      await request(app)
        .delete(`/api/comment/${commentId}`)
        .set("Authorization", `JWT ${otherUserResponse.body.accessToken}`)
        .expect(401);
    });

    it("should return 500 when encountering internal server error while deleting comment", async () => {
      jest.spyOn(Comment, "findByIdAndDelete").mockImplementationOnce(() => {
        throw new Error("Internal Server Error");
      });

      const response = await request(app)
        .delete(`/api/comment/${commentId2}`)
        .set("Authorization", `JWT ${accessToken}`)
        
      expect(response.status).toBe(500);

      expect(response.body).toHaveProperty("error", "Internal Server Error");
    }, 100000);
  });
});
