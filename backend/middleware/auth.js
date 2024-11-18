const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);

    if (!user) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token is not valid, please refresh it" });
  }
};

exports.admin = async (req, res, next) => {
  const { user } = req;
  if (!user || user.role !== "admin") {
    // Ensure user has admin role
    return res.status(403).json({ message: "Access denied, admin only" });
  }

  next();
};

