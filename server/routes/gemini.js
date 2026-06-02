import { Router } from "express";
import { generateText } from "../services/aiClient.js";
import { genders, orientations, classes, races, languages, personalityTraits, ideals, bonds, flaws, alignments, rollStat, physicalStats, names, ageRanges, eyeColors, hairColors, hairStyles, skinTones, distinguishingFeatures, mannerisms, clothingStyles
} from "../data/dndOptions.js";
import { pickRandom, rollHeightWeight, randomInRange } from "../utils/random.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const data = req.body;

    const filled = {
      name: data.name || pickRandom(names),
      gender: data.gender || pickRandom(genders),
      eyeColor: pickRandom(eyeColors),
      hairColor: pickRandom(hairColors),
      hairStyle: pickRandom(hairStyles),
      skinTone: pickRandom(skinTones),
      distinguishingFeature: pickRandom(distinguishingFeatures),
      clothingStyle: pickRandom(clothingStyles),
      orientation: data.orientation || pickRandom(orientations),
      charClass: data.charClass || pickRandom(classes),
      race: data.race || pickRandom(races),
      languages: data.languages || pickRandom(languages),
      mannerism: pickRandom(mannerisms),
      personalityTraits: data.personalityTraits || pickRandom(personalityTraits),
      ideals: data.ideals || pickRandom(ideals),
      bonds: data.bonds || pickRandom(bonds),
      flaws: data.flaws || pickRandom(flaws),
      alignment: data.alignment || pickRandom(alignments),
      stats: {
        strength: data.stats?.strength || rollStat(),
        dexterity: data.stats?.dexterity || rollStat(),
        constitution: data.stats?.constitution || rollStat(),
        intelligence: data.stats?.intelligence || rollStat(),
        wisdom: data.stats?.wisdom || rollStat(),
        charisma: data.stats?.charisma || rollStat()
      }
    };

    const { heightInches, weight } = rollHeightWeight(
      filled.race,
      physicalStats
    );

    const [minAge, maxAge] = ageRanges[filled.race] || [18, 60];
    filled.age = randomInRange(minAge, maxAge);

    const prompt = `
      Create a detailed Dungeons & Dragons character background using the following details:

      ${JSON.stringify(filled, null, 2)}

      Write a compelling, lore‑friendly backstory (3–6 paragraphs).
    `;

    const background = await generateText(prompt);

    res.json({ text: background, filled });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini request failed" });
  }
});

export default router;
