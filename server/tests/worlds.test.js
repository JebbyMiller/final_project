import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test-secret";
process.env.ADMIN_EMAIL = "admin@test.com";

vi.mock("../daos/world.js", () => ({
  createWorld: vi.fn(),
  rerollWorld: vi.fn(),
  updateWorld: vi.fn(),
  getWorld: vi.fn(),
  getAllWorlds: vi.fn(),
  browseWorlds: vi.fn(),
  deleteWorld: vi.fn(),
}));

vi.mock("../services/aiClient.js", () => ({
  generateText: vi.fn().mockResolvedValue("Generated world lore."),
}));

vi.mock("../models/user.js", () => ({
  default: { findById: vi.fn() },
}));

import app from "../app.js";
import User from "../models/user.js";
import {
  createWorld,
  rerollWorld,
  updateWorld,
  getWorld,
  getAllWorlds,
  browseWorlds,
  deleteWorld,
} from "../daos/world.js";

const adminToken = jwt.sign(
  { id: "adminId", email: "admin@test.com", username: "admin" },
  "test-secret"
);

const userToken = jwt.sign(
  { id: "userId", email: "user@test.com", username: "user" },
  "test-secret"
);

const fakeUser = { _id: "userId", username: "user" };

describe("GET /worlds/browse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findById.mockResolvedValue(fakeUser);
  });

  it("returns all worlds for any logged-in user", async () => {
    const worlds = [{ _id: "w1", name: "Middle Earth", lore: "..." }];
    browseWorlds.mockResolvedValue(worlds);

    const res = await request(app)
      .get("/worlds/browse")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.worlds).toHaveLength(1);
  });

  it("supports text search query", async () => {
    browseWorlds.mockResolvedValue([]);

    const res = await request(app)
      .get("/worlds/browse?search=dragon")
      .set("Authorization", `Bearer ${userToken}`);

    expect(browseWorlds).toHaveBeenCalledWith("dragon");
    expect(res.status).toBe(200);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get("/worlds/browse");
    expect(res.status).toBe(401);
  });
});

describe("POST /worlds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findById.mockResolvedValue({ _id: "adminId", username: "admin" });
  });

  it("creates world as admin", async () => {
    const fakeWorld = { _id: "w1", name: "Azeroth", lore: "Generated world lore." };
    createWorld.mockResolvedValue(fakeWorld);

    const res = await request(app)
      .post("/worlds")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Azeroth",
        geography: "Vast continents",
        factions: "Horde and Alliance",
        history: "Ancient conflicts",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.world.name).toBe("Azeroth");
  });

  it("returns 403 for non-admin", async () => {
    const res = await request(app)
      .post("/worlds")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Test World" });

    expect(res.status).toBe(403);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).post("/worlds").send({ name: "Test" });
    expect(res.status).toBe(401);
  });
});

describe("POST /worlds/:id/reroll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findById.mockResolvedValue({ _id: "adminId", username: "admin" });
  });

  it("rerolls world lore as admin", async () => {
    const updated = { _id: "w1", lore: "New lore." };
    rerollWorld.mockResolvedValue(updated);

    const res = await request(app)
      .post("/worlds/w1/reroll")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Azeroth", geography: "x", factions: "y", history: "z" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns 403 for non-admin", async () => {
    const res = await request(app)
      .post("/worlds/w1/reroll")
      .set("Authorization", `Bearer ${userToken}`)
      .send({});

    expect(res.status).toBe(403);
  });
});

describe("PUT /worlds/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findById.mockResolvedValue(fakeUser);
  });

  it("updates a world", async () => {
    const updated = { _id: "w1", name: "Updated World" };
    updateWorld.mockResolvedValue(updated);

    const res = await request(app)
      .put("/worlds/w1")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Updated World" });

    expect(res.status).toBe(200);
    expect(res.body.world.name).toBe("Updated World");
  });

  it("returns 401 without token", async () => {
    const res = await request(app).put("/worlds/w1").send({ name: "x" });
    expect(res.status).toBe(401);
  });
});

describe("GET /worlds/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findById.mockResolvedValue(fakeUser);
  });

  it("returns a single world", async () => {
    const world = { _id: "w1", name: "Narnia" };
    getWorld.mockResolvedValue(world);

    const res = await request(app)
      .get("/worlds/w1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.world.name).toBe("Narnia");
  });
});

describe("GET /worlds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findById.mockResolvedValue(fakeUser);
  });

  it("returns all worlds for the user", async () => {
    const worlds = [{ _id: "w1", name: "Westeros" }];
    getAllWorlds.mockResolvedValue(worlds);

    const res = await request(app)
      .get("/worlds")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.worlds).toHaveLength(1);
  });
});

describe("DELETE /worlds/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findById.mockResolvedValue(fakeUser);
  });

  it("deletes a world", async () => {
    deleteWorld.mockResolvedValue({ _id: "w1" });

    const res = await request(app)
      .delete("/worlds/w1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).delete("/worlds/w1");
    expect(res.status).toBe(401);
  });
});
