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
