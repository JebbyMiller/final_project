import express from "express";
import { createWorld, rerollWorld, updateWorld, getWorld, getAllWorlds, deleteWorld, } from "../daos/world.js";

import isAuthorized from "../middleware/isAuthorized.js";
import formatPrompt from "../middleware/formatPrompt.js";
import { generateText } from "../services/aiClient.js";

const router = express.Router();

router.post("/", isAuthorized, formatPrompt("world"), async (req, res) => {
  try {
    const aiText = await generateText(req.prompt);
    const world = await createWorld(req.user.id, {
      ...req.body,
      lore: aiText,
    });

    res.json({ success: true, world });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/:id/reroll", isAuthorized, formatPrompt("world"), async (req, res) => {
  try {
    const aiText = await generateText(req.prompt);
    const updated = await rerollWorld(req.params.id, { lore: aiText });

    res.json({ success: true, world: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", isAuthorized, async (req, res) => {
  try {
    const updated = await updateWorld(req.params.id, req.body);
    res.json({ success: true, world: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id", isAuthorized, async (req, res) => {
  try {
    const world = await getWorld(req.params.id, req.user.id);
    res.json({ success: true, world });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", isAuthorized, async (req, res) => {
  try {
    const worlds = await getAllWorlds(req.user.id, req.query);
    res.json({ success: true, worlds });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", isAuthorized, async (req, res) => {
  try {
    await deleteWorld(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
