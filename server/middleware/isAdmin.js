import jwt from "jsonwebtoken";

export default function isAdmin(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "Missing token" });

    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.user = { id: decoded.id, username: decoded.username, email: decoded.email };
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
