// backend/src/controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import userModel from "../models/user.model.js";
import { sendOtpEmail } from "../services/email.service.js";


const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// YT-AUTH/src/controllers/auth.controller.js
const signAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1h" });

const signRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email, and password are required" });
    }

    const existing = await userModel.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: "User with this email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({ username, email, password: hashedPassword });

    return res.status(201).json({
      message: "User registered",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.status(200).json({
      message: "Login successful",
      accessToken, // also returned in body for Postman/API testing convenience
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password -refreshToken -otpHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token provided" });

    const decoded = jwt.verify(token, REFRESH_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = signAccessToken(user);
    res.cookie("accessToken", newAccessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.id) {
        await userModel.findByIdAndUpdate(decoded.id, { refreshToken: null });
      }
    }
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logoutAll = async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.user.id, { refreshToken: null });
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    return res.status(200).json({ message: "Logged out from all sessions" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });

    if (!user || !user.otpHash || !user.otpExpiry) {
      return res.status(400).json({ message: "No pending verification for this email" });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    if (hashOtp(otp) !== user.otpHash) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.verified = true;
    user.otpHash = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({ message: "Email verified" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(200).json({ message: "If that email exists, an OTP was sent" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpHash = hashOtp(otp);
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: "If that email exists, an OTP was sent" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await userModel.findOne({ email });

    if (!user || !user.otpHash || !user.otpExpiry) {
      return res.status(400).json({ message: "No pending reset for this email" });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    if (hashOtp(otp) !== user.otpHash) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otpHash = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};