// backend/src/models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username must be unique"]
  },
  email: {
    type: String,
    required: [true, "Email must be unique"],
    unique: [true, "Email must be unique"],
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  verified: {
    type: Boolean,
    default: false
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  score: { type: Number, default: 0 },
  problemsSolved: { type: Number, default: 0 },
  solvedProblemIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],

  // --- new: needed for auth ---
  refreshToken: { type: String, default: null },
  otpHash: { type: String, default: null },
  otpExpiry: { type: Date, default: null },

  // backend/src/models/user.model.js — add this field
  hintsUsedProblemIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
})

const userModel = mongoose.model("users", userSchema);
export default userModel;