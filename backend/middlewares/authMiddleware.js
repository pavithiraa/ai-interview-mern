const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1]; // extratct the token
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id).select("-password");
      next();
    } else {
      res.status(401).json({ message: "Not authorized, no reason" });
    }
  } catch (err) {
    res.status(401).json({ message: "Token failed", error: err.message });
  }
};

module.exports = { protect };
