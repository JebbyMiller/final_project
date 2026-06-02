export default function formatPrompt(type) {
  return (req, res, next) => {
    try {
      if (type === "character") {
        const { name, race, class: charClass, stats } = req.body;

        req.prompt = `
            Generate a detailed D&D-style character background.

            Name: ${name}
            Race: ${race}
            Class: ${charClass}

            Stats:
            STR: ${stats?.str}
            DEX: ${stats?.dex}
            CON: ${stats?.con}
            INT: ${stats?.int}
            WIS: ${stats?.wis}
            CHA: ${stats?.cha}

            Write a rich, immersive backstory (3–5 paragraphs) including:
            - upbringing
            - defining events
            - motivations
            - flaws
            - allies/enemies
            - future hooks
                    `;
                }

                if (type === "world") {
                    const { name, geography, factions, history } = req.body;

                    req.prompt = `
            Generate a detailed fantasy world lore entry.

            World Name: ${name}

            Geography: ${geography}
            Factions: ${factions}
            History: ${history}

            Write a cohesive, immersive lore document (4–6 paragraphs) including:
            - major regions
            - political tensions
            - cultural traits
            - myths and legends
            - threats and mysteries
            - adventure hooks
        `;
      }

      next();
    } catch (err) {
      res.status(400).json({ error: "Failed to format prompt" });
    }
  };
}
