import World from "../models/world.js";

export async function createWorld(userId, worldData) {
  return World.create({ userId, ...worldData });
}

export async function rerollWorld(worldId, newData) {
  return World.findByIdAndUpdate(
    worldId,
    { ...newData, updatedAt: new Date() },
    { new: true }
  );
}

export async function updateWorld(worldId, updates) {
  return World.findByIdAndUpdate(
    worldId,
    { ...updates, updatedAt: new Date() },
    { new: true }
  );
}

export async function getWorld(worldId, userId) {
  return World.findOne({ _id: worldId, userId });
}

export async function getAllWorlds(userId, filters = {}) {
  return World.find({ userId, ...filters }).sort({ updatedAt: -1 });
}

export async function browseWorlds(search = "") {
  if (search) {
    return World.find({ $text: { $search: search } }).sort({ updatedAt: -1 });
  }
  return World.find({}).sort({ updatedAt: -1 });
}

export async function deleteWorld(worldId, userId) {
  return World.findOneAndDelete({ _id: worldId, userId });
}
