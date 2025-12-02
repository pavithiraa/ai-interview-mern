const Session = require("../models/Session");
const Question = require("../models/Question");

exports.createSession = async (req, res) => {
  try {
    const { role, experience, topicToFocus, description, questions } = req.body;
    //from middleware
    const userId = req.user.id;

    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicToFocus,
      description,
    });

    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
        });
        return question._id;
      })
    );
    session.questions = questionDocs;
    await session.save();

    res.status(200).json({ success: true, session });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate({
        path: "questions",
        options: { sort: { isPinned: -1, createdAt: -1 } },
      })
      .exec();

    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};
exports.getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("questions");

    res.status(200).json(sessions);
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.deleteSessions = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this session" });
    }

    await Question.deleteMany({ session: session._id });
    await session.deleteOne();

    res.status(200).json({ message: "Session deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
