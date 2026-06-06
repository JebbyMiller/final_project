export const names = [
    "Arin", "Lyra", "Thorne", "Mira", "Kael", "Jebadeiah", "Adylehd"
];

export const genders = [
  "Male", "Female", "Nonbinary", "Agender", "Genderfluid", "Transgender"
];

export const orientations = [
  "Heterosexual", "Homosexual", "Bisexual", "Pansexual", "Asexual"
];

export const classes = [
  "Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Mage", "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Thief", "Warlock", "Wizard"
];

export const races = [
  "Aarakocra", "Aasimar", "Air Genasi", "Alfar Hidden Elf", "Astral Elf", "Autognome", "Baugsmidr Dward", "Bearfolk", "Beastkin", "Boggart", "Bugbear", "Centaur", "Cervan", "Changeling", "Cnidaran", "Corvum", "Cyclopian", "Dara", "Darakhul", "Deep Gnome", "Dhakaani Ghaal'dar Hobgoblin", "Dhakaani Golin'dar Goblin", "Dhakaani Guul'dar Bugbear", "Dhampir", "The Disembodied", "Dragonborn", "Durgar", "Dwarf", "Earth Genasi", "Eladrin", "Elf", "Erina", "Fairy", "Feathren", "Feral Tielfing", "Faerie", "Firbolg", "Fire Genasi", "Fjord Dwarf", "Flamekin", "Gallus", "Genasi", "Geppetting", "Giantkin", "Giff", "Gith", "Githyanki", "Githzerai", "Gnoll", "Gnome", "Gobboc", "Goblin", "Goliath", "Golynn", "Grung", "Hadozee", "Half-Elf", "Half-Orc", "Halfling", "Harengon", "Hedge", "Hexblood", "Hobgoblin", "Human", "Ice Elf", "Jerbeen", "Jhorgun'taal Half-Orc", "Kalamer Landwalker Merfolk", "Kalashtar", "Kender", "Kenku", "Khoravar", "Kithkin", "Kobold", "Leonin", "Lizardfolk", "Locathah", "Lorwyn Changeling", "Lorwyn-Shadowmoor Elf", "Lotol", "Loxodon", "Luma", "Mapach", "Mandrake", "Minotaur", "Mycelian", "Nakudama", "Ombrask", "Oozekin", "Opteran", "Orc", "Owlin", "Plasmoid", "Quickstep", "Rakin", "Raptor", "Ratatosk", "Ravenfolk", "Reborn", "Rimekin", "Ruinbound", "Sahuagin", "Satarre", "Satyr", "Sea Elf", "Shadar-kai", "Shade", "Shadow Goblin", "Shifter", "Simic Hyrbid", "Strig", "Tabaxi",  "Thri-kreen", "Tiefling", "Tortle", "Triton", "Trollkin", "Umbral Human", "Vedalken", "Verdan", "Vulpin", "Warforged", "Water Genasi", "Werekin", "Wechselkind", "Yuan-ti", "Yuan-ti Pureblood"
];

export const languages = [
  "Common", "Dwarvish", "Elvish", "Giant", "Gnomish", "Goblin", "Halfling", "Orc", "Abyssal", "Celestial", "Draconi", "Deep Speech", "Infernal", "Primordial", "Sylan", "Undercommon"
];

export const personalityTraits = [
  "I speak rarely but choose my words carefully.",
  "I see the best in everyone.",
  "I’m always polite and respectful.",
  "I’m driven by curiosity.",
  "I judge people harshly.",
  "I'm incredibly charismatic",
  "I give people the creeps",
  "I love flirting with everyone"
];

export const ideals = [
  "Charity", "Freedom", "Power", "Knowledge", "Tradition", "Balance", "Justice", "Redemption", "Might"
];

export const bonds = [
  "I owe my life to the mentor who taught me everything.",
  "I'm seeking revenge on the person who murdered my mother",
  "I protect those who cannot protect themselves.",
  "I seek the truth about my mysterious past."
];

export const flaws = [
  "I can’t resist a pretty face.",
  "I'm afraid of everything",
  "I’m quick to anger.",
  "I’m overly trusting.",
  "I hoard secrets.",
  "I freeze under pressure."
];

export const alignments = [
  "Lawful Good (LG)", "Neutral Good (NG)", "Chaotic Good (CG)", "Lawful Neutral (LN)", "Neutral (N)", "Chaotic Neutral (CN)", "Lawful Evil (LE)", "Neutral Evil (NE)", "Chaotic Evil (CE)"
];

export function rollStat() {
  const rolls = [
    1 + Math.floor(Math.random() * 6),
    1 + Math.floor(Math.random() * 6),
    1 + Math.floor(Math.random() * 6),
    1 + Math.floor(Math.random() * 6)
  ];
  rolls.sort((a, b) => a - b);
  return rolls[1] + rolls[2] + rolls[3];
}

export const physicalStats = {
  Human: {
    baseHeight: 56,
    heightDice: [2, 10],
    baseWeight: 110,
    weightDice: [2, 4]
  },
  Elf: {
    baseHeight: 54,
    heightDice: [2, 10],
    baseWeight: 90,
    weightDice: [1, 4]
  },
  Dwarf: {
    baseHeight: 48,
    heightDice: [2, 4],
    baseWeight: 130,
    weightDice: [2, 6]
  },
  Halfling: {
    baseHeight: 31,
    heightDice: [2, 4],
    baseWeight: 35,
    weightDice: [1, 1]
  },
  Gnome: {
    baseHeight: 35,
    heightDice: [2, 4],
    baseWeight: 40,
    weightDice: [1, 1]
  },
  "Half-Elf": {
    baseHeight: 57,
    heightDice: [2, 8],
    baseWeight: 100,
    weightDice: [2, 4]
  },
  "Half-Orc": {
    baseHeight: 58,
    heightDice: [2, 10],
    baseWeight: 140,
    weightDice: [2, 6]
  },
  Tiefling: {
    baseHeight: 57,
    heightDice: [2, 8],
    baseWeight: 110,
    weightDice: [2, 4]
  },
  Dragonborn: {
    baseHeight: 66,
    heightDice: [2, 8],
    baseWeight: 175,
    weightDice: [2, 6]
  }
};

export const ageRanges = {
  Human: [18, 60],
  Elf: [100, 750],
  Dwarf: [50, 350],
  Halfling: [20, 150],
  Gnome: [40, 425],
  "Half-Elf": [20, 180],
  "Half-Orc": [14, 75],
  Tiefling: [18, 100],
  Dragonborn: [15, 80]
};

export const eyeColors = ["Brown", "Blue", "Green", "Hazel", "Amber", "Gray", "Violet", "Red (rare)", "Gold (rare)"
];

export const hairColors = ["Black", "Brown", "Blonde", "Red", "White", "Gray", "Silver", "Blue-tinted", "Fiery red", "Jet black"
];

export const hairStyles = [
  "Long and braided",
  "Short and messy",
  "Shoulder-length and straight",
  "Curly and wild",
  "Shaved on the sides",
  "Topknot",
  "Loose waves",
  "Tightly bound ponytail"
];

export const skinTones = ["Pale", "Fair", "Tan", "Olive", "Brown", "Dark brown", "Ashen", "Ruddy", "Bronze", "Bluish (tiefling/dragonborn)"
];

export const distinguishingFeatures = [
  "A long scar across the cheek",
  "A tattoo of a forgotten symbol",
  "A missing fingertip",
  "A burn mark on the forearm",
  "Unusual eye coloration",
  "A holy symbol worn at all times",
  "A nervous twitch",
  "A melodic speaking voice",
  "A limp from an old injury"
];

export const mannerisms = [
  "Speaks softly but intensely",
  "Laughs loudly and often",
  "Pauses before answering",
  "Rolls their shoulders when nervous",
  "Keeps eye contact uncomfortably long",
  "Talks with sweeping gestures",
  "Has a gravelly voice",
  "Speaks with a musical cadence"
];

export const clothingStyles = [
  "Simple traveler’s garb",
  "Noble-inspired attire",
  "Rough leathers and furs",
  "Colorful patchwork clothing",
  "Dark hooded cloak",
  "Practical adventurer’s gear",
  "Robes embroidered with symbols",
  "Military-style uniform"
];
