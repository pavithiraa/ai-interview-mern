const express = require("express");

const { protect } = require("../middlewares/authMiddleware");
const {
  addQuestionsToSession,
  updateQuestionNote,
  togglePinQuestion,
} = require("../controllers/questionController");

const routes = express.Router();

routes.post("/add", protect, addQuestionsToSession);
routes.post("/:id/note", protect, updateQuestionNote);
routes.post("/:id/pin", protect, togglePinQuestion);

module.exports = routes;
