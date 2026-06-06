import {
  names,
  genders,
  orientations,
  classes,
  races,
  languages,
  personalityTraits,
  ideals,
  bonds,
  flaws,
  alignments
} from "../data/dndOptions.js";

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function rollStat() {
  const rolls = Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 6));
  rolls.sort((a, b) => a - b);
  return rolls[1] + rolls[2] + rolls[3];
}

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
