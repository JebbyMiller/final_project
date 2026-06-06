import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function isAuthorized(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "Missing token" });

    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: "Invalid token" });

    req.user = { id: user._id, username: user.username };
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
}
