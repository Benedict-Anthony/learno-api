const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

let token;
let createdPost;
jest.setTimeout(25000);

beforeAll(async () => {
  // Clean up test user if exists
  await prisma.user.deleteMany({ where: { email: "posttester@example.com" } });

  // Create test user
  await request(app).post("/api/auth/register").send({
    name: "Post Tester",
    email: "posttester@example.com",
    password: "testpassword",
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "posttester@example.com",
    password: "testpassword",
  });

  token = loginRes.body.token;
});

afterAll(async () => {
  // Clean up created post and user
  await prisma.post.deleteMany({ where: { title: "Test Post" } });
  await prisma.user.deleteMany({ where: { email: "posttester@example.com" } });

  await prisma.$disconnect();
});

describe("POST /api/posts", () => {
  it("should create a new post", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Post",
        content: "This is a test post content.",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("post");
    expect(res.body.post.title).toBe("Test Post");

    createdPost = res.body.post;
  });

  it("should fail to create a post without token", async () => {
    const res = await request(app).post("/api/posts").send({
      title: "Unauthorized Post",
      content: "No token provided",
    });

    expect(res.statusCode).toBe(400);
  });
});

describe("GET /api/posts", () => {
  it("should return all posts", async () => {
    const res = await request(app).get("/api/posts");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("title");
  });
});

describe("GET /api/posts/:id", () => {
  it("should return a single post by id", async () => {
    const res = await request(app).get(`/api/posts/${createdPost.id}`);

    expect(res.statusCode).toBe(200);
  });
});
