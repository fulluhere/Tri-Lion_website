// backend/src/controllers/ai.controller.js
import userModel from "../models/user.model.js";
import problemModel from "../models/problem.model.js";
import submissionModel from "../models/submission.model.js";
import { generateHint, analyzeSubmission } from "../services/ai.service.js";

export const getHint = async (req, res) => {
  try {
    const { problemId, userCode } = req.body;
    if (!problemId) {
      return res.status(400).json({ message: "problemId is required" });
    }

    const problem = await problemModel.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const hint = await generateHint({
      problemTitle: problem.title,
      problemDescription: problem.description,
      difficulty: problem.difficulty,
      userCode,
    });

    const user = await userModel.findById(req.user.id);
    const alreadyMarked = user.hintsUsedProblemIds.some(
      (id) => id.toString() === problemId.toString()
    );
    if (!alreadyMarked) {
      user.hintsUsedProblemIds.push(problemId);
      await user.save();
    }

    return res.status(200).json({ hint });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getSubmissionAnalysis = async (req, res) => {
  try {
    const { submissionId } = req.body;
    if (!submissionId) {
      return res.status(400).json({ message: "submissionId is required" });
    }

    const submission = await submissionModel.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.userID?.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to analyze this submission" });
    }

    if (!["WA", "TLE"].includes(submission.verdict)) {
      return res.status(400).json({ message: "Analysis is only available for WA or TLE submissions" });
    }

    const problem = await problemModel.findById(submission.problemID);
    if (!problem) {
      return res.status(404).json({ message: "Associated problem not found" });
    }

    const failedCase = submission.testCases?.[submission.testCasesPassed];

    const analysis = await analyzeSubmission({
      problemTitle: problem.title,
      problemDescription: problem.description,
      code: submission.code,
      language: submission.language,
      verdict: submission.verdict,
      failedInput: failedCase?.input,
      expectedOutput: failedCase?.expectedOutput,
      actualOutput: submission.output,
    });

    submission.aiReport = analysis;
    await submission.save();

    return res.status(200).json({ analysis });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};