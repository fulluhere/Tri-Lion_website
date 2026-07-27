// backend/src/services/scoring.service.js (or online-compiler, wherever verdict is finalized)
import User from '../models/user.model.js';
import Problem from '../models/problem.model.js';

// online-compiler/src/services/scoring.service.js — update this function
const DIFFICULTY_POINTS = { Easy: 10, Medium: 20, Hard: 30 };
const HINT_PENALTY_MULTIPLIER = 0.5; // 50% score reduction if hint was used

export async function updateScoreOnAccept(userID, problemID) {
  if (!userID || !problemID) {
    console.warn('Skipping score update: missing userID or problemID');
    return null;
  }

  const user = await userModel.findById(userID);
  if (!user) throw new Error('User not found');

  const alreadySolved = user.solvedProblemIds.some(
    (id) => id.toString() === problemID.toString()
  );
  if (alreadySolved) return user;

  const problem = await problemModel.findById(problemID);
  if (!problem) throw new Error('Problem not found');

  let points = DIFFICULTY_POINTS[problem.difficulty] ?? 0;

  const usedHint = user.hintsUsedProblemIds?.some(
    (id) => id.toString() === problemID.toString()
  );
  if (usedHint) {
    points = Math.round(points * HINT_PENALTY_MULTIPLIER);
  }

  user.score += points;
  user.problemsSolved += 1;
  user.solvedProblemIds.push(problemID);
  await user.save();

  return user;
}