import { getLeaderboard } from '../services/leaderboard.service.js';

export async function getLeaderboardHandler(req, res) {
  try {
    const leaderboard = await getLeaderboard();
    return res.json({ success: true, leaderboard });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.toString() });
  }
}