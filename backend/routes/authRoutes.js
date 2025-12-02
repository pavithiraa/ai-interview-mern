const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const routes = express.Router();

routes.post("/register", registerUser);
routes.post("/login", loginUser);
routes.get("/profile", protect, getUserProfile);

module.exports = routes;
