const express = require("express");
const {
  createSession,
  getSessionById,
  getMySessions,
  deleteSessions,
} = require("../controllers/sessionController");
const { protect } = require("../middlewares/authMiddleware");

const routes = express.Router();

routes.post("/create", protect, createSession);
routes.get("/my-sessions", protect, getMySessions);
routes.get("/:id", protect, getSessionById);
routes.delete("/:id", protect, deleteSessions);

module.exports = routes;
