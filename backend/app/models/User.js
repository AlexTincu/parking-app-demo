const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // vehiclePlate: { type: String, required: true },
  role: { type: String, required: true, default: "guest" },
});

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  // Check if the password field has been modified (only hash if it's a new or updated password)
  if (!this.isModified("password")) return next();

  try {
    // Hash the password with a salt factor of 10
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

// Compare passwords method for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
