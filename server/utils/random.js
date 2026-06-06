export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function rollDice(count, sides) {
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += 1 + Math.floor(Math.random() * sides);
  }
  return total;
}

export function rollHeightWeight(race, physicalStats) {
  const entry = physicalStats[race] || {
    baseHeight: 69,
    heightDice: [2, 10],
    baseWeight: 200,
    weightDice: [2, 4],
  };

  const heightMod = rollDice(entry.heightDice[0], entry.heightDice[1]);
  const weightMod = rollDice(entry.weightDice[0], entry.weightDice[1]);

  const height = entry.baseHeight + heightMod;
  const weight = entry.baseWeight + heightMod * weightMod;

  return { height, weight };
}
