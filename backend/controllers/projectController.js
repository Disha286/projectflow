const Project = require('../models/Project');
const Label = require('../models/Label');
const Workspace = require('../models/Workspace');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create project
// @route   POST /api/projects
const createProject = asyncHandler(async (req, res) => {
  const { name, description, workspaceId, color, icon, type, visibility, startDate, endDate } = req.body;

  if (!name || !workspaceId) {
    res.status(400);
    throw new Error('Project name and workspace are required');
  }

  // Check if user is member of workspace
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    res.status(404);
    throw new Error('Workspace not found');
  }

  const isMember = workspace.members.find(
    m => m.user.toString() === req.user._id.toString()
  );
  if (!isMember) {
    res.status(403);
    throw new Error('You are not a member of this workspace');
  }

  const project = await Project.create({
    name,
    description,
    workspace: workspaceId,
    owner: req.user._id,
    color,
    icon,
    type,
    visibility,
    startDate,
    endDate,
    members: [{ user: req.user._id, role: 'manager' }]
  });

  // Create default labels
  await Label.insertMany([
    { name: 'Bug', color: '#ef4444', project: project._id },
    { name: 'Feature', color: '#6366f1', project: project._id },
    { name: 'Enhancement', color: '#22c55e', project: project._id },
    { name: 'Documentation', color: '#f59e0b', project: project._id }
  ]);

  await project.populate('members.user', 'name email avatar');

  res.status(201).json({ success: true, project });
});

// @desc    Get all projects in workspace
// @route   GET /api/projects/workspace/:workspaceId
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    workspace: req.params.workspaceId,
    $or: [
      { visibility: 'public' },
      { 'members.user': req.user._id }
    ]
  }).populate('members.user', 'name email avatar')
    .populate('owner', 'name email avatar');

  res.json({ success: true, projects });
});

// @desc    Get single project
// @route   GET /api/projects/:projectId
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId)
    .populate('members.user', 'name email avatar')
    .populate('owner', 'name email avatar');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  res.json({ success: true, project });
});

// @desc    Update project
// @route   PUT /api/projects/:projectId
const updateProject = asyncHandler(async (req, res) => {
  const { name, description, color, icon, type, visibility, status, startDate, endDate } = req.body;

  const project = await Project.findByIdAndUpdate(
    req.params.projectId,
    { name, description, color, icon, type, visibility, status, startDate, endDate },
    { new: true, runValidators: true }
  ).populate('members.user', 'name email avatar');

  res.json({ success: true, project });
});

// @desc    Delete project
// @route   DELETE /api/projects/:projectId
const deleteProject = asyncHandler(async (req, res) => {
  await Project.findByIdAndDelete(req.params.projectId);
  await Label.deleteMany({ project: req.params.projectId });
  res.json({ success: true, message: 'Project deleted successfully' });
});

// @desc    Add project member
// @route   POST /api/projects/:projectId/members
const addMember = asyncHandler(async (req, res) => {
  const { userId, role = 'member' } = req.body;
  const project = await Project.findById(req.params.projectId);

  const alreadyMember = project.members.find(
    m => m.user.toString() === userId
  );
  if (alreadyMember) {
    res.status(400);
    throw new Error('User is already a project member');
  }

  project.members.push({ user: userId, role });
  await project.save();
  await project.populate('members.user', 'name email avatar');

  res.json({ success: true, project });
});

// @desc    Remove project member
// @route   DELETE /api/projects/:projectId/members/:userId
const removeMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  project.members = project.members.filter(
    m => m.user.toString() !== req.params.userId
  );
  await project.save();

  res.json({ success: true, message: 'Member removed successfully' });
});

// @desc    Get project labels
// @route   GET /api/projects/:projectId/labels
const getLabels = asyncHandler(async (req, res) => {
  const labels = await Label.find({ project: req.params.projectId });
  res.json({ success: true, labels });
});

// @desc    Create label
// @route   POST /api/projects/:projectId/labels
const createLabel = asyncHandler(async (req, res) => {
  const { name, color } = req.body;
  const label = await Label.create({
    name,
    color,
    project: req.params.projectId
  });
  res.status(201).json({ success: true, label });
});

// @desc    Delete label
// @route   DELETE /api/projects/:projectId/labels/:labelId
const deleteLabel = asyncHandler(async (req, res) => {
  await Label.findByIdAndDelete(req.params.labelId);
  res.json({ success: true, message: 'Label deleted' });
});

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getLabels,
  createLabel,
  deleteLabel
};