const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("../generated/prisma");
// const app = require("../index"); // update to match your Express app export
const prisma = new PrismaClient();
jest.setTimeout(25000);

beforeAll(async () => {
  // Clean up test user if exists
  await prisma.user.deleteMany({ where: { email: "test@example.com" } });
});
describe("User Routes", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      name: "Test User",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("email");
  });

  it("should login an existing user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
