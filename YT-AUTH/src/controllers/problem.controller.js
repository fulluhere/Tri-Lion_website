// src/controllers/problem.controller.js
import Problem from '../models/problem.model.js';

export const createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, tags, constraints, testCases, isPublished } = req.body;
    const slug = title.toLowerCase().replace(/\s+/g, '-');

    const existing = await Problem.findOne({ slug });
    if (existing) return res.status(409).json({ message: 'Problem with this title already exists' });

    const problem = await Problem.create({
      title, slug, description, difficulty, tags, constraints, testCases,
      isPublished: isPublished ?? false,
      createdBy: req.user.id,
    });

    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const getAllProblems = async (req, res) => {
  // for the list page — don't send hidden test cases!
  const problems = await Problem.find({ isPublished: true })
    .select('title slug difficulty tags');
  res.status(200).json(problems);
};

export const getProblemBySlug = async (req, res) => {
  const problem = await Problem.findOne({ slug: req.params.slug, isPublished: true });
  if (!problem) return res.status(404).json({ message: 'Problem not found' });

  // Important: strip hidden test cases before sending to a regular user
  const visibleTestCases = problem.testCases.filter(tc => !tc.isHidden);
  res.status(200).json({ ...problem.toObject(), testCases: visibleTestCases });
};

export const updateProblem = async (req, res) => {
  const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!problem) return res.status(404).json({ message: 'Problem not found' });
  res.status(200).json(problem);
};

// in problem.controller.js, add this export
// in problem.controller.js
export const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Problem.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    return res.status(200).json({ message: 'Problem deleted', problem: deleted });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};