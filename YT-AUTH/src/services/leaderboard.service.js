import userModel from '../models/user.model.js';

export async function getLeaderboard(limit = 50) {
  const users = await userModel
    .find({})
    .sort({ score: -1 })
    .limit(limit)
    .select('username score problemsSolved');

  return users;
}