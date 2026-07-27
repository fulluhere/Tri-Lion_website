// YT-AUTH/src/models/submission.model.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const SubmissionSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    problemID: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: false,
    },
    language: {
      type: String,
      required: true,
      enum: ["cpp", "python", "java", "javascript"],
    },
    code: {
      type: String,
      required: true,
    },
    testCases: [
      {
        input: { type: String, default: "" },
        expectedOutput: { type: String, default: "" },
      },
    ],
    verdict: {
      type: String,
      enum: ["PENDING", "AC", "WA", "TLE", "MLE", "RE", "CE"],
      default: "PENDING",
    },
    runtime: { type: Number, default: 0 },
    memory: { type: Number, default: 0 },
    output: { type: String, default: "" },
    errorMessage: { type: String, default: "" },
    testCasesPassed: { type: Number, default: 0 },
    testCasesTotal: { type: Number, default: 0 },
    startedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

export default model("Submission", SubmissionSchema);