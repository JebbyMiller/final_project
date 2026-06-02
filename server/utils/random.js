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
  const entry = physicalStats[race];

  if (!entry) {
    return {
      heightInches: 60,
      weight: 150
    };
  }

  const heightMod = rollDice(entry.heightMod[0], entry.heightMod[1]);
  const weightMod = rollDice(entry.weightMod[0], entry.weightMod[1]);

  const heightInches = entry.baseHeight + heightMod;
  const weight = entry.baseWeight + heightMod * weightMod;

  return { heightInches, weight };
}
