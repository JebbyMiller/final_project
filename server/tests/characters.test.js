import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test-secret";
process.env.ADMIN_EMAIL = "admin@test.com";

vi.mock("../daos/character.js", () => ({
  createCharacter: vi.fn(),
  rerollCharacter: vi.fn(),
  updateCharacter: vi.fn(),
  getCharacter: vi.fn(),
  getAllCharacters: vi.fn(),
  browseCharacters: vi.fn(),
  deleteCharacter: vi.fn(),
}));

vi.mock("../services/aiClient.js", () => ({
  generateText: vi.fn().mockResolvedValue("Generated background text."),
}));

// jwtAuth doesn't need the DB — only isAuthorized does
vi.mock("../models/user.js", () => ({
  default: { findById: vi.fn() },
}));

import app from "../app.js";
import User from "../models/user.js";
import {
  createCharacter,
  rerollCharacter,
  updateCharacter,
  getCharacter,
  getAllCharacters,
  browseCharacters,
  deleteCharacter,
} from "../daos/character.js";

const adminToken = jwt.sign(
  { id: "adminId", email: "admin@test.com", username: "admin" },
  "test-secret"
);

const userToken = jwt.sign(
  { id: "userId", email: "user@test.com", username: "user" },
  "test-secret"
);

const fakeUser = { _id: "userId", username: "user" };
const fakeAdmin = { _id: "adminId", username: "admin" };

describe("GET /characters/browse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findById.mockResolvedValue(fakeUser);
  });

  it("returns all characters for any logged-in user", async () => {
    const chars = [{ _id: "c1", name: "Aragorn", backgroundText: "..." }];
    browseCharacters.mockResolvedValue(chars);

    const res = await request(app)
      .get("/characters/browse")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.characters).toHaveLength(1);
  });

  it("supports text search query", async () => {
    browseCharacters.mockResolvedValue([]);

    const res = await request(app)
      .get("/characters/browse?search=ranger")
      .set("Authorization", `Bearer ${userToken}`);

    expect(browseCharacters).toHaveBeenCalledWith("ranger");
    expect(res.status).toBe(200);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get("/characters/browse");
    expect(res.status).toBe(401);
  });
});

describe("POST /characters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findById.mockResolvedValue(fakeAdmin);
  });

  it("creates character as admin", async () => {
    const fakeChar = { _id: "c1", name: "Legolas", backgroundText: "Generated background text." };
    createCharacter.mockResolvedValue(fakeChar);

    const res = await request(app)
      .post("/characters")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Legolas",
        race: "Elf",
        charClass: "Ranger",
        stats: { str: 12, dex: 18, con: 14, int: 14, wis: 16, cha: 13 },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.character.name).toBe("Legolas");
  });

  it("returns 403 for non-admin", async () => {
    const res = await request(app)
      .post("/characters")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Test", race: "Human", charClass: "Fighter" });

    expect(res.status).toBe(403);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).post("/characters").send({ name: "Test" });
    expect(res.status).toBe(401);
  });
});

describe("POST /characters/:id/reroll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findById.mockResolvedValue(fakeAdmin);
  });

  it("rerolls character background as admin", async () => {
    const updated = { _id: "c1", backgroundText: "New background." };
    rerollCharacter.mockResolvedValue(updated);

    const res = await request(app)
      .post("/characters/c1/reroll")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Legolas", race: "Elf", charClass: "Ranger", stats: {} });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns 403 for non-admin", async () => {
    const res = await request(app)
      .post("/characters/c1/reroll")
      .set("Authorization", `Bearer ${userToken}`)
      .send({});

    expect(res.status).toBe(403);
  });
});

describe("PUT /characters/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findById.mockResolvedValue(fakeUser);
  });

  it("updates a character", async () => {
    const updated = { _id: "c1", name: "Updated Name" };
    updateCharacter.mockResolvedValue(updated);

    const res = await request(app)
      .put("/characters/c1")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Updated Name" });

    expect(res.status).toBe(200);
    expect(res.body.character.name).toBe("Updated Name");
  });

  it("returns 401 without token", async () => {
    const res = await request(app).put("/characters/c1").send({ name: "x" });
    expect(res.status).toBe(401);
  });
});

describe("GET /characters/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findById.mockResolvedValue(fakeUser);
  });

  it("returns a single character", async () => {
    const char = { _id: "c1", name: "Gimli" };
    getCharacter.mockResolvedValue(char);

    const res = await request(app)
      .get("/characters/c1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.character.name).toBe("Gimli");
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get("/characters/c1");
    expect(res.status).toBe(401);
  });
});

describe("GET /characters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findById.mockResolvedValue(fakeUser);
  });

  it("returns all characters for the user", async () => {
    const chars = [{ _id: "c1", name: "Gandalf" }];
    getAllCharacters.mockResolvedValue(chars);

    const res = await request(app)
      .get("/characters")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.characters).toHaveLength(1);
  });
});

describe("DELETE /characters/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findById.mockResolvedValue(fakeUser);
  });

  it("deletes a character", async () => {
    deleteCharacter.mockResolvedValue({ _id: "c1" });

    const res = await request(app)
      .delete("/characters/c1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).delete("/characters/c1");
    expect(res.status).toBe(401);
  });
});
