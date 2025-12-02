const { GoogleGenAI } = require("@google/genai");
const {
  conceptExplainPrompt,
  questionAnswerPrompt,
} = require("../utlis/prompts");
const { json } = require("express");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

//generate interview question and answer using genAI

const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicToFocus, numberOfQuestions } = req.body;
    if (!role || !experience || !topicToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicToFocus,
      numberOfQuestions
    );

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    let rawText = response.text;
    //remove json
    // Clean it: Remove ```json and ``` from beginning and end
    const cleanedText = rawText
      .replace(/^```json\s*/, "") // remove starting ```json
      .replace(/```$/, "") // remove ending ```
      .trim(); // remove extra spaces

    const data = JSON.parse(cleanedText);
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to  generate questions", error: error.message });
  }
};

//generate explains a interview questions
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const prompt = conceptExplainPrompt(question);
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });
    let rawText = response.text;
    //remove json
    // Clean it: Remove ```json and ``` from beginning and end
    const cleanedText = rawText
      .replace(/^```json\s*/, "") // remove starting ```json
      .replace(/```$/, "") // remove ending ```
      .trim(); // remove extra spaces

    const data = JSON.parse(cleanedText);
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to  generate questions", error: error.message });
  }
};

module.exports = { generateConceptExplanation, generateInterviewQuestions };
