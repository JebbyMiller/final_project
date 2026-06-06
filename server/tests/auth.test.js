import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test-secret";
process.env.ADMIN_EMAIL = "admin@test.com";

vi.mock("../daos/user.js", () => ({
  createUser: vi.fn(),
  authUser: vi.fn(),
  resetPassword: vi.fn(),
}));

vi.mock("../models/User.js", () => ({
  default: { findById: vi.fn() },
}));

import app from "../app.js";
import { createUser, authUser, resetPassword } from "../daos/user.js";

describe("POST /auth/signup", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns new user on success", async () => {
    const fakeUser = { _id: "uid1", username: "tester", email: "t@t.com" };
    createUser.mockResolvedValue(fakeUser);

    const res = await request(app)
      .post("/auth/signup")
      .send({ username: "tester", email: "t@t.com", password: "pass123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.username).toBe("tester");
  });

  it("returns 400 on duplicate user error", async () => {
    createUser.mockRejectedValue(new Error("duplicate key"));

    const res = await request(app)
      .post("/auth/signup")
      .send({ username: "tester", email: "t@t.com", password: "pass" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });
});

describe("POST /auth/login", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns JWT token on success", async () => {
    const fakeUser = { _id: "uid1", username: "tester", email: "t@t.com" };
    authUser.mockResolvedValue(fakeUser);

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "t@t.com", password: "pass123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeTruthy();
    const decoded = jwt.verify(res.body.token, "test-secret");
    expect(decoded.email).toBe("t@t.com");
  });

  it("returns 401 on invalid credentials", async () => {
    authUser.mockResolvedValue(null);

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "bad@test.com", password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });

  it("returns 400 on DAO error", async () => {
    authUser.mockRejectedValue(new Error("db error"));

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "t@t.com", password: "pass" });

    expect(res.status).toBe(400);
  });
});

describe("POST /auth/password", () => {
  beforeEach(() => vi.clearAllMocks());

  it("resets password successfully", async () => {
    const fakeUser = { _id: "uid1", username: "tester" };
    resetPassword.mockResolvedValue(fakeUser);

    const res = await request(app)
      .post("/auth/password")
      .send({ userId: "uid1", newPassword: "newpass" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns 400 on error", async () => {
    resetPassword.mockRejectedValue(new Error("not found"));

    const res = await request(app)
      .post("/auth/password")
      .send({ userId: "bad", newPassword: "x" });

    expect(res.status).toBe(400);
  });
});

describe("GET /auth/is-admin", () => {
  it("returns isAdmin true for admin email", () => {
    const token = jwt.sign(
      { id: "uid1", email: "admin@test.com", username: "admin" },
      "test-secret"
    );

    return request(app)
      .get("/auth/is-admin")
      .set("Authorization", `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.isAdmin).toBe(true);
      });
  });

  it("returns isAdmin false for non-admin email", () => {
    const token = jwt.sign(
      { id: "uid2", email: "user@test.com", username: "user" },
      "test-secret"
    );

    return request(app)
      .get("/auth/is-admin")
      .set("Authorization", `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.isAdmin).toBe(false);
      });
  });

  it("returns isAdmin false with no token", () => {
    return request(app)
      .get("/auth/is-admin")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.isAdmin).toBe(false);
      });
  });
});
