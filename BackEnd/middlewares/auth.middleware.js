const User = require("../models/auth.model");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(400)
        .json({ success: false, error: "token is missing" });
    }
    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
      return res
        .status(400)
        .json({ success: false, error: "token is missing or invalid" });
    }
    const user = await User.findById(decode._id).select("-password");
    if (!user) {
      return res.status(400).json({ success: false, error: "User not found" });
    }
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    next();
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = authMiddleware;
