const User = require("../models/auth.model");
const jwt = require("jsonwebtoken");

const signToken = (user) =>
  jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );

// Sign Up User
const SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "All filed required" });
    }
    // check user
    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, error: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user);
    return res.status(201).json({
      success: true,
      message: "User Created successfully",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Login User
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "All filed required" });
    }
    // check user
    const user = await User.findOne({ email }).select(
      "-password"
    );
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }
    const ok = await user.isPasswordCorrect(password);
    if (!ok) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }
    const token = signToken(user);

    return res
      .status(201)
      .json({ success: true, message: "User Login successfully", user, token });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { SignUp, Login };
