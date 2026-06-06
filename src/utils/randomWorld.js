import {
  worldNames,
  geographies,
  factionsList,
  histories
} from "../data/dndOptions.js";

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function fillWorldDefaults(world) {
  return {
    name: world.name || `World of ${pickRandom(worldNames)}`,
    geography: world.geography || pickRandom(geographies),
    factions: world.factions || pickRandom(factionsList),
    history: world.history || pickRandom(histories),
  };
}
