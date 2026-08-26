const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { signToken } = require("../utils/jwt.util");

const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide full name, email and password." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "This email address is already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ff3838&color=fff`;

    const newUser = await User.create({
      name,
      email,
      phone: phone || null,
      passwordHash,
      avatarUrl,
      roleName: "customer",
    });

    const token = signToken({ id: newUser.id, email: newUser.email, role: newUser.role });

    res.status(201).json({
      message: "Account registered successfully!",
      data: {
        user: newUser,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter your email and password." });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (user.status === "blocked") {
      return res.status(403).json({ message: "Your account has been suspended. Please contact support." });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    const { passwordHash, ...userData } = user;

    res.json({
      message: "Signed in successfully!",
      data: {
        user: userData,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User profile not found." });
    }
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatarUrl } = req.body;
    const updated = await User.updateProfile(req.user.id, { name, phone, avatarUrl });
    res.json({
      message: "Profile updated successfully!",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile, updateProfile };
