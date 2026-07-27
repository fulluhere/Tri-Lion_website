// src/routes/problem.routes.js
import { Router } from 'express';
import * as problemController from '../controllers/problem.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js'; // whatever you named it
import { isAdmin } from '../middlewares/admin.middleware.js';

const problemRouter = Router();

problemRouter.post('/', verifyToken, isAdmin, problemController.createProblem);
problemRouter.get('/', problemController.getAllProblems);
problemRouter.get('/:slug', problemController.getProblemBySlug);
problemRouter.put('/:id', verifyToken, isAdmin, problemController.updateProblem);
problemRouter.delete('/:id', verifyToken, isAdmin, problemController.deleteProblem);


export default problemRouter;