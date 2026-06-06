import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../models/Character.js", () => ({
  default: {
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findOne: vi.fn(),
    find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue([]) })),
    findOneAndDelete: vi.fn(),
  },
}));

vi.mock("../models/World.js", () => ({
  default: {
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findOne: vi.fn(),
    find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue([]) })),
    findOneAndDelete: vi.fn(),
  },
}));

vi.mock("../models/User.js", () => ({
  default: {
    create: vi.fn(),
    findOne: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
}));

import Character from "../models/Character.js";
import World from "../models/World.js";
import User from "../models/User.js";

import {
  createCharacter,
  rerollCharacter,
  updateCharacter,
  getCharacter,
  getAllCharacters,
  browseCharacters,
  deleteCharacter,
} from "../daos/character.js";

import {
  createWorld,
  rerollWorld,
  updateWorld,
  getWorld,
  getAllWorlds,
  browseWorlds,
  deleteWorld,
} from "../daos/world.js";

import { createUser, authUser, resetPassword } from "../daos/user.js";

describe("createCharacter", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls Character.create with userId and data", async () => {
    const fake = { _id: "c1", name: "Aragorn" };
    Character.create.mockResolvedValue(fake);

    const result = await createCharacter("uid1", { name: "Aragorn", charClass: "Ranger" });
    expect(Character.create).toHaveBeenCalledWith({ userId: "uid1", name: "Aragorn", charClass: "Ranger" });
    expect(result.name).toBe("Aragorn");
  });
});

describe("rerollCharacter", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls findByIdAndUpdate with new data", async () => {
    const updated = { _id: "c1", backgroundText: "New background" };
    Character.findByIdAndUpdate.mockResolvedValue(updated);

    const result = await rerollCharacter("c1", { backgroundText: "New background" });
    expect(Character.findByIdAndUpdate).toHaveBeenCalled();
    expect(result.backgroundText).toBe("New background");
  });
});

describe("updateCharacter", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls findByIdAndUpdate with updates", async () => {
    const updated = { _id: "c1", name: "Updated" };
    Character.findByIdAndUpdate.mockResolvedValue(updated);

    const result = await updateCharacter("c1", { name: "Updated" });
    expect(result.name).toBe("Updated");
  });
});

describe("getCharacter", () => {
  beforeEach(() => vi.clearAllMocks());

  it("finds character by id and userId", async () => {
    const char = { _id: "c1", name: "Gimli" };
    Character.findOne.mockResolvedValue(char);

    const result = await getCharacter("c1", "uid1");
    expect(Character.findOne).toHaveBeenCalledWith({ _id: "c1", userId: "uid1" });
    expect(result.name).toBe("Gimli");
  });
});

describe("getAllCharacters", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns characters sorted by updatedAt", async () => {
    const chars = [{ _id: "c1" }];
    Character.find.mockReturnValue({ sort: vi.fn().mockResolvedValue(chars) });

    const result = await getAllCharacters("uid1");
    expect(Character.find).toHaveBeenCalledWith({ userId: "uid1" });
    expect(result).toEqual(chars);
  });
});

describe("browseCharacters", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns all characters when no search", async () => {
    const chars = [{ _id: "c1" }];
    Character.find.mockReturnValue({ sort: vi.fn().mockResolvedValue(chars) });

    const result = await browseCharacters("");
    expect(Character.find).toHaveBeenCalledWith({});
    expect(result).toEqual(chars);
  });

  it("uses text search when query provided", async () => {
    Character.find.mockReturnValue({ sort: vi.fn().mockResolvedValue([]) });

    await browseCharacters("ranger");
    expect(Character.find).toHaveBeenCalledWith({ $text: { $search: "ranger" } });
  });
});

describe("deleteCharacter", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls findOneAndDelete with id and userId", async () => {
    Character.findOneAndDelete.mockResolvedValue({ _id: "c1" });

    await deleteCharacter("c1", "uid1");
    expect(Character.findOneAndDelete).toHaveBeenCalledWith({ _id: "c1", userId: "uid1" });
  });
});

describe("createWorld", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls World.create with userId and data", async () => {
    const fake = { _id: "w1", name: "Middle Earth" };
    World.create.mockResolvedValue(fake);

    const result = await createWorld("uid1", { name: "Middle Earth" });
    expect(World.create).toHaveBeenCalledWith({ userId: "uid1", name: "Middle Earth" });
    expect(result.name).toBe("Middle Earth");
  });
});

describe("rerollWorld", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls findByIdAndUpdate with new lore", async () => {
    const updated = { _id: "w1", lore: "New lore" };
    World.findByIdAndUpdate.mockResolvedValue(updated);

    const result = await rerollWorld("w1", { lore: "New lore" });
    expect(result.lore).toBe("New lore");
  });
});

describe("updateWorld", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls findByIdAndUpdate with updates", async () => {
    const updated = { _id: "w1", name: "Narnia" };
    World.findByIdAndUpdate.mockResolvedValue(updated);

    const result = await updateWorld("w1", { name: "Narnia" });
    expect(result.name).toBe("Narnia");
  });
});

describe("getWorld", () => {
  beforeEach(() => vi.clearAllMocks());

  it("finds world by id and userId", async () => {
    const world = { _id: "w1", name: "Westeros" };
    World.findOne.mockResolvedValue(world);

    const result = await getWorld("w1", "uid1");
    expect(World.findOne).toHaveBeenCalledWith({ _id: "w1", userId: "uid1" });
    expect(result.name).toBe("Westeros");
  });
});

describe("getAllWorlds", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns worlds sorted by updatedAt", async () => {
    const worlds = [{ _id: "w1" }];
    World.find.mockReturnValue({ sort: vi.fn().mockResolvedValue(worlds) });

    const result = await getAllWorlds("uid1");
    expect(World.find).toHaveBeenCalledWith({ userId: "uid1" });
    expect(result).toEqual(worlds);
  });
});

describe("browseWorlds", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns all worlds when no search", async () => {
    const worlds = [{ _id: "w1" }];
    World.find.mockReturnValue({ sort: vi.fn().mockResolvedValue(worlds) });

    const result = await browseWorlds("");
    expect(World.find).toHaveBeenCalledWith({});
    expect(result).toEqual(worlds);
  });

  it("uses text search when query provided", async () => {
    World.find.mockReturnValue({ sort: vi.fn().mockResolvedValue([]) });

    await browseWorlds("dragon");
    expect(World.find).toHaveBeenCalledWith({ $text: { $search: "dragon" } });
  });
});

describe("deleteWorld", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls findOneAndDelete with id and userId", async () => {
    World.findOneAndDelete.mockResolvedValue({ _id: "w1" });

    await deleteWorld("w1", "uid1");
    expect(World.findOneAndDelete).toHaveBeenCalledWith({ _id: "w1", userId: "uid1" });
  });
});

describe("createUser", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates user with hashed password", async () => {
    const fakeUser = { _id: "u1", username: "tester", email: "t@t.com" };
    User.create.mockResolvedValue(fakeUser);

    const result = await createUser({ username: "tester", email: "t@t.com", password: "pass" });
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({ username: "tester", email: "t@t.com" })
    );
    expect(result.username).toBe("tester");
  });
});

describe("authUser", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when user not found", async () => {
    User.findOne.mockResolvedValue(null);
    const result = await authUser({ email: "x@x.com", password: "pass" });
    expect(result).toBeNull();
  });
});

describe("resetPassword", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates passwordHash", async () => {
    const updated = { _id: "u1" };
    User.findByIdAndUpdate.mockResolvedValue(updated);

    const result = await resetPassword("u1", "newpass");
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({ passwordHash: expect.any(String) }),
      { new: true }
    );
    expect(result._id).toBe("u1");
  });
});
