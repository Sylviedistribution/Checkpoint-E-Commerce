import jwt from "jsonwebtoken";
import User from "../models/User.js";

const buildAuthResponse = (user) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Un compte existe déjà avec cet email" });
    }
    const user = await User.create({ name, email, password });
    res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    const isValidPassword = user ? await user.comparePassword(password) : false;
    if (!isValidPassword) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
    res.json(buildAuthResponse(user));
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = (req, res) => {
  const { _id, name, email, role } = req.user;
  res.json({ user: { id: _id, name, email, role } });
};
