const Sprint = require('../models/Sprint');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create sprint
// @route   POST /api/sprints/project/:projectId
const createSprint = asyncHandler(async (req, res) => {
  const { name, goal, startDate, endDate } = req.body;

  const sprint = await Sprint.create({
    name,
    goal,
    project: req.params.projectId,
    startDate,
    endDate
  });

  res.status(201).json({ success: true, sprint });
});

// @desc    Get sprints for project
// @route   GET /api/sprints/project/:projectId
const getSprints = asyncHandler(async (req, res) => {
  const sprints = await Sprint.find({ project: req.params.projectId })
    .sort({ createdAt: -1 });
  res.json({ success: true, sprints });
});

// @desc    Get single sprint
// @route   GET /api/sprints/:sprintId
const getSprint = asyncHandler(async (req, res) => {
  const sprint = await Sprint.findById(req.params.sprintId);
  if (!sprint) {
    res.status(404);
    throw new Error('Sprint not found');
  }
  res.json({ success: true, sprint });
});

// @desc    Update sprint
// @route   PUT /api/sprints/:sprintId
const updateSprint = asyncHandler(async (req, res) => {
  const sprint = await Sprint.findByIdAndUpdate(
    req.params.sprintId,
    req.body,
    { new: true, runValidators: true }
  );
  res.json({ success: true, sprint });
});

// @desc    Start sprint
// @route   POST /api/sprints/:sprintId/start
const startSprint = asyncHandler(async (req, res) => {
  const sprint = await Sprint.findByIdAndUpdate(
    req.params.sprintId,
    { status: 'active' },
    { new: true }
  );
  res.json({ success: true, sprint });
});

// @desc    Complete sprint
// @route   POST /api/sprints/:sprintId/complete
const completeSprint = asyncHandler(async (req, res) => {
  const sprint = await Sprint.findByIdAndUpdate(
    req.params.sprintId,
    { status: 'completed', completedAt: Date.now() },
    { new: true }
  );
  res.json({ success: true, sprint });
});

// @desc    Delete sprint
// @route   DELETE /api/sprints/:sprintId
const deleteSprint = asyncHandler(async (req, res) => {
  await Sprint.findByIdAndDelete(req.params.sprintId);
  res.json({ success: true, message: 'Sprint deleted' });
});

module.exports = {
  createSprint,
  getSprints,
  getSprint,
  updateSprint,
  startSprint,
  completeSprint,
  deleteSprint
};