const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");

describe("Authentication Endpoints", () => {
  const userData = {
    name: "User",
    email: "testuser@example.com",
    password: "password123",
    vehiclePlate: "AB-1234",
  };

  // beforeAll(async () => {});
  
  beforeEach(async () => {
    await User.deleteMany({ email: userData.email });
  });

  afterAll(async () => {    
    await User.deleteMany({}); // Clean up the test user from the database
    await mongoose.connection.close();    
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(userData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should login an existing user", async () => {
    
    await request(app).post("/api/auth/register").send(userData);

    const res = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });

  it("should return an error if user already exists", async () => {    
    await User.create(userData);

    const res = await request(app).post("/api/auth/register").send(userData);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });
});
