const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const createToken = (user) => {
  const payload = { user: { id: user.id } };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Registration handler
exports.register = async (req, res) => {
  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, vehiclePlate } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ name, email, password, vehiclePlate });

    await user.save();

    // Generate JWT token
    const token = createToken(user);

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Login handler
exports.login = async (req, res) => {
  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    // Check if user exists && Validate password
    if (!user || !user.comparePassword(password)) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = createToken(user);

    res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
