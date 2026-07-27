import express from 'express';
import { getLeaderboardHandler } from '../controllers/leaderboard.controller.js';

const router = express.Router();
router.get('/', getLeaderboardHandler);

export default router;