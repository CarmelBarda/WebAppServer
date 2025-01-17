import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import { User } from "../models/models";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

jest.mock("google-auth-library");
jest.setTimeout(10000);
let app: Express;

const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  password: "password123",
  type: "student",
  bio: "Sample bio",
};

let accessToken: string;
let refreshToken: string;
let newRefreshToken: string;

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany({ email: userData.email });
});
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Authentication tests", () => {
  describe("Registration API", () => {
    it("should return 500 given error during user registration", async () => {
      // Mocking the User.save method to throw an error
      jest.spyOn(User.prototype, "save").mockImplementationOnce(() => {
        throw new Error("Mocked user creation error");
      });

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(500);

      expect(response.body).toHaveProperty("message", "Error: Mocked user creation error");

    });

    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(userData);
      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
    });

    it("should handle missing information", async () => {
      const incompleteData = {
        name: "John Doe",
        email: "john.doe@example.com",
        // Missing password
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty("message", "no password or email provided");
    });

    it("should handle duplicate email registration", async () => {
      const duplicateResponse = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(500);
        expect(duplicateResponse.body)
          .toHaveProperty("message", "this email is already in use. try to login");
    });
  });

  describe("Login API", () => {
    it("should return 400 if email or password is missing", async () => {
      const response = await request(app).post("/api/auth/login").send({});

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "no password or email provided");
    });

    it("should return 401 if email is incorrect", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "nonexistent@example.com", password: "wrongpassword" });

      expect(response.status).toBe(401);
      expect(response.text).toContain("bad email, try again");
    });

    it("should return 401 if password is incorrect", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: userData.email, password: "wrongpassword" });

      expect(response.status).toBe(401);
      expect(response.text).toContain("wrong email or password");
    });

    // Test for successful login
    it("should return 200 with access and refresh tokens if credentials are correct", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "john.doe@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it("should return 500 if any error occurs during the process", async () => {
      // Mocking the User.findOne method to throw an error
      jest
        .spyOn(User, "findOne")
        .mockRejectedValueOnce(new Error("Database error"));

      const response = await request(app)
        .post("/api/auth/login")
        .set("Authorization", `JWT ${refreshToken}`)
        .send({ email: "john.doe@example.com", password: "password123" });
        
        
      expect(response.status).toBe(500);

      expect(response.text).toContain("Database error");
    });
  });

  describe("Refresh Token API", () => {
    it("should handle expired refresh token after timeout", async () => {
      // Mocking expired refresh token
      const expiredRefreshToken = jwt.sign({ _id: "userId" }, "expiredSecret", {
        expiresIn: "-1s",
      });

      const response = await request(app)
        .post("/api/auth/refreshToken")
        .set("Authorization", `JWT ${expiredRefreshToken}`)
        .expect(403);

      expect(response.text).toContain("invalid request");
    });

    it("should handle missing authorization token during token refresh", async () => {
      const response = await request(app).post("/api/auth/refreshToken").expect(403);

      expect(response.text).toContain("invalid request");
    });

    it("should handle invalid authorization token during token refresh", async () => {
      const response = await request(app)
        .post("/api/auth/refreshToken")
        .set("Authorization", "JWT InvalidToken")
        .expect(403);

      expect(response.text).toContain("invalid request");
    });

    it("should return 401 if user not found in the database", async () => {
      // Mocking the User.findById method to return null
      jest.spyOn(User, "findById").mockResolvedValueOnce(null);

      const response = await request(app)
        .post("/api/auth/refreshToken")
        .set("Authorization", `JWT ${refreshToken}`)
        .expect(401);

      expect(response.text).toContain("User not found");
    });

    it("should return 500 if any error occurs during the process", async () => {
      // Mocking the User.findOne method to throw an error
      jest
        .spyOn(User, "findOne")
        .mockRejectedValueOnce(new Error("Database error"));

      const response = await request(app)
        .post("/api/auth/refreshToken")
        .set("Authorization", `JWT ${refreshToken}`)
        .expect(500);

      expect(response.text).toContain("Database error");
    });

    it("should refresh access token with valid refresh token", async () => {
      const response = await request(app)
        .post("/api/auth/refreshToken")
        .set("Authorization", `JWT ${refreshToken}`)
        .expect(200);

      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();

      const newAccessToken = response.body.accessToken;
      newRefreshToken = response.body.refreshToken;

      const response2 = await request(app)
        .get("/api/post")
        .set("Authorization", `JWT ${newAccessToken}`);
      expect(response2.statusCode).toBe(200);
    });
  });

  describe("Logout API", () => {
    it("should handle missing authorization token during logout", async () => {
      const response = await request(app).post("/api/auth/logout").expect(403);

      expect(response.text).toContain("invalid request");
    });

    it("should handle invalid authorization token during logout", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", "JWT InvalidToken")
        .expect(403);

      expect(response.text).toContain("invalid request");
    });

    it("should handle invalid refresh token", async () => {
      // Mocking invalid refresh token
      const invalidRefreshToken = jwt.sign({ _id: "userId" }, "invalidSecret");

      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `JWT ${invalidRefreshToken}`)
        .expect(403);

      expect(response.text).toContain("invalid request");
    });

    it("should return 500 if any error occurs during the process", async () => {
      // Mocking the User.findById method to throw an error
      jest
        .spyOn(User, "findById")
        .mockRejectedValueOnce(new Error("Database error"));

      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `JWT ${newRefreshToken}`)
        .expect(403);

      expect(response.text).toContain("Database error");
    });

    it("should handle successful logout", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `JWT ${newRefreshToken}`)
        .expect(200);

      expect(response.text).toContain("logged out");
    });
  });
});
