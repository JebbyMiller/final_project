// ─── Source arrays (mirrored from server/data/dndOptions.js) ─────────────────

export const names = [
  "Arin", "Lyra", "Thorne", "Mira", "Kael", "Jebadeiah", "Adylehd",
  "Seraph", "Dusk", "Ember", "Rowan", "Vale", "Cinder", "Zephyr",
  "Oryn", "Sable", "Vex", "Nira", "Calder", "Wren",
];

export const genders = [
  "Male", "Female", "Nonbinary", "Agender", "Genderfluid", "Transgender",
];

export const orientations = [
  "Heterosexual", "Homosexual", "Bisexual", "Pansexual", "Asexual",
];

export const classes = [
  "Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Monk",
  "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard",
];

export const races = [
  "Human", "Elf", "Dwarf", "Halfling", "Gnome", "Half-Elf", "Half-Orc",
  "Tiefling", "Dragonborn", "Aasimar", "Genasi", "Tabaxi", "Kenku",
  "Warforged", "Changeling", "Shifter", "Firbolg", "Goliath", "Triton",
  "Lizardfolk", "Kobold", "Goblin", "Hobgoblin", "Bugbear", "Orc",
  "Minotaur", "Centaur", "Satyr", "Fairy", "Owlin", "Dhampir",
];

export const languages = [
  "Common", "Dwarvish", "Elvish", "Giant", "Gnomish", "Goblin",
  "Halfling", "Orc", "Abyssal", "Celestial", "Draconic", "Deep Speech",
  "Infernal", "Primordial", "Sylvan", "Undercommon",
];

export const personalityTraits = [
  "I speak rarely but choose my words carefully.",
  "I see the best in everyone.",
  "I'm always polite and respectful.",
  "I'm driven by curiosity and wonder.",
  "I judge people harshly but hold myself to the same standard.",
  "I never back down from a challenge.",
  "I have a dark sense of humor.",
  "I prefer action to words.",
  "I'm haunted by something I witnessed long ago.",
  "I collect small mementos from every place I visit.",
];

export const ideals = [
  "Charity — I give what I can to those in need.",
  "Freedom — no one should be told what to think or feel.",
  "Power — knowledge is the path to dominance.",
  "Knowledge — the key to a better world.",
  "Tradition — the old ways must be preserved.",
  "Balance — extremes destroy; the middle path endures.",
  "Glory — the world will know my name.",
  "Redemption — I seek to atone for past wrongs.",
];

export const bonds = [
  "I owe my life to the mentor who taught me everything.",
  "I protect those who cannot protect themselves.",
  "I seek the truth about my mysterious past.",
  "I will avenge the destruction of my hometown.",
  "I carry a keepsake from someone I lost.",
  "I made a promise I intend to keep no matter the cost.",
];

export const flaws = [
  "I can't resist a pretty face.",
  "I'm quick to anger.",
  "I'm overly trusting of strangers.",
  "I hoard secrets even from allies.",
  "I freeze under pressure.",
  "Pride clouds my better judgment.",
  "I can't admit when I'm wrong.",
  "I never turn down a bet.",
];

export const alignments = [
  "Lawful Good (LG)", "Neutral Good (NG)", "Chaotic Good (CG)",
  "Lawful Neutral (LN)", "Neutral (N)", "Chaotic Neutral (CN)",
  "Lawful Evil (LE)", "Neutral Evil (NE)", "Chaotic Evil (CE)",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Roll 4d6, drop the lowest — standard D&D stat generation.
 * Returns a number roughly between 3 and 18.
 */
export function rollStat() {
  const rolls = Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 6));
  rolls.sort((a, b) => a - b);
  return rolls[1] + rolls[2] + rolls[3]; // drop lowest
}

/** Roll all six stats at once and return an object. */
export function rollAllStats() {
  return {
    str: rollStat(),
    dex: rollStat(),
    con: rollStat(),
    int: rollStat(),
    wis: rollStat(),
    cha: rollStat(),
  };
}

/**
 * Given the form data, return a copy with any blank fields filled in randomly.
 * Stats default to 10 if none are provided (caller can pre-roll if desired).
 */
export function fillDefaults(data) {
  return {
    name:             data.name             || pickRandom(names),
    gender:           data.gender           || pickRandom(genders),
    orientation:      data.orientation      || pickRandom(orientations),
    charClass:        data.charClass        || pickRandom(classes),
    race:             data.race             || pickRandom(races),
    languages:        data.languages        || pickRandom(languages),
    alignment:        data.alignment        || pickRandom(alignments),
    personalityTraits: data.personalityTraits || pickRandom(personalityTraits),
    ideals:           data.ideals           || pickRandom(ideals),
    bonds:            data.bonds            || pickRandom(bonds),
    flaws:            data.flaws            || pickRandom(flaws),
    stats: {
      str: data.stats?.str || rollStat(),
      dex: data.stats?.dex || rollStat(),
      con: data.stats?.con || rollStat(),
      int: data.stats?.int || rollStat(),
      wis: data.stats?.wis || rollStat(),
      cha: data.stats?.cha || rollStat(),
    },
  };
}
