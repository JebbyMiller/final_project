import express from "express";
import jwt from "jsonwebtoken";
import { createUser, authUser, resetPassword } from "../daos/user.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await authUser(req.body);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ 
      id: user._id,
      username: user.username,
      email: user.email
    }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/password", async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    const updated = await resetPassword(userId, newPassword);
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/is-admin", (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.json({ isAdmin: false });

    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const isAdmin = decoded.email === process.env.ADMIN_EMAIL;

    res.json({ isAdmin });
  } catch {
    res.json({ isAdmin: false });
  }
});

export default router;
