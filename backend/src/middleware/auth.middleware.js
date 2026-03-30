const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // get header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    // format: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info
    req.user = decoded; // { id: ... }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = authMiddleware;
