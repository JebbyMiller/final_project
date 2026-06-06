/**
 * Lightweight auth middleware — validates the JWT without a database lookup.
 * Used for read-only browse endpoints where any valid token holder may access.
 */
import jwt from "jsonwebtoken";

export default function jwtAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "Missing token" });

    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id, username: decoded.username, email: decoded.email };
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
