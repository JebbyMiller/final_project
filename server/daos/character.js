import Character from "../models/character.js";

export async function createCharacter(userId, characterData) {
  return Character.create({ userId, ...characterData });
}

export async function rerollCharacter(characterId, newData) {
  return Character.findByIdAndUpdate(
    characterId,
    { ...newData, updatedAt: new Date() },
    { new: true }
  );
}

export async function updateCharacter(characterId, updates) {
  return Character.findByIdAndUpdate(
    characterId,
    { ...updates, updatedAt: new Date() },
    { new: true }
  );
}

export async function getCharacter(characterId, userId) {
  return Character.findOne({ _id: characterId, userId });
}

export async function getAllCharacters(userId, filters = {}) {
  return Character.find({ userId, ...filters }).sort({ updatedAt: -1 });
}

export async function browseCharacters(search = "") {
  if (search) {
    return Character.find({ $text: { $search: search } }).sort({ updatedAt: -1 });
  }
  return Character.find({}).sort({ updatedAt: -1 });
}

export async function deleteCharacter(characterId, userId) {
  return Character.findOneAndDelete({ _id: characterId, userId });
}
