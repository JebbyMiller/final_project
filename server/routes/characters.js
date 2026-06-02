import express from "express";
import { createCharacter, rerollCharacter, updateCharacter, getCharacter, getAllCharacters, deleteCharacter, } from "../daos/character.js";

import isAuthorized from "../middleware/isAuthorized.js";
import formatPrompt from "../middleware/formatPrompt.js";
import { generateText } from "../services/aiClient.js";

const router = express.Router();

router.post("/", isAuthorized, formatPrompt("character"), async (req, res) => {
  try {
    const aiText = await generateText(req.prompt);
    const character = await createCharacter(req.user.id, {
      ...req.body,
      backgroundText: aiText,
    });

    res.json({ success: true, character });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/:id/reroll", isAuthorized, formatPrompt("character"), async (req, res) => {
  try {
    const aiText = await generateText(req.prompt);
    const updated = await rerollCharacter(req.params.id, {
      backgroundText: aiText,
    });

    res.json({ success: true, character: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", isAuthorized, async (req, res) => {
  try {
    const updated = await updateCharacter(req.params.id, req.body);
    res.json({ success: true, character: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id", isAuthorized, async (req, res) => {
  try {
    const character = await getCharacter(req.params.id, req.user.id);
    res.json({ success: true, character });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", isAuthorized, async (req, res) => {
  try {
    const characters = await getAllCharacters(req.user.id, req.query);
    res.json({ success: true, characters });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", isAuthorized, async (req, res) => {
  try {
    await deleteCharacter(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
