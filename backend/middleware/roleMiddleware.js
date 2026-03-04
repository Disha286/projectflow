const Workspace = require('../models/Workspace');
const asyncHandler = require('../utils/asyncHandler');

// Check if user is a member of workspace
const isMember = asyncHandler(async (req, res, next) => {
  const workspace = await Workspace.findById(req.params.workspaceId);

  if (!workspace) {
    res.status(404);
    throw new Error('Workspace not found');
  }

  const member = workspace.members.find(
    m => m.user.toString() === req.user._id.toString()
  );

  if (!member) {
    res.status(403);
    throw new Error('You are not a member of this workspace');
  }

  req.workspace = workspace;
  req.memberRole = member.role;
  next();
});

// Check if user is admin or owner
const isAdmin = asyncHandler(async (req, res, next) => {
  const workspace = await Workspace.findById(req.params.workspaceId);

  if (!workspace) {
    res.status(404);
    throw new Error('Workspace not found');
  }

  const member = workspace.members.find(
    m => m.user.toString() === req.user._id.toString()
  );

  if (!member || !['owner', 'admin'].includes(member.role)) {
    res.status(403);
    throw new Error('You need admin privileges');
  }

  req.workspace = workspace;
  req.memberRole = member.role;
  next();
});

// Check if user is owner
const isOwner = asyncHandler(async (req, res, next) => {
  const workspace = await Workspace.findById(req.params.workspaceId);

  if (!workspace) {
    res.status(404);
    throw new Error('Workspace not found');
  }

  if (workspace.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only workspace owner can perform this action');
  }

  req.workspace = workspace;
  req.memberRole = 'owner';
  next();
});

module.exports = { isMember, isAdmin, isOwner };