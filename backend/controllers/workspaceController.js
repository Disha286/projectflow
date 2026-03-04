const crypto = require('crypto');
const Workspace = require('../models/Workspace');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendEmail } = require('../utils/sendEmail');

// @desc    Create workspace
// @route   POST /api/workspaces
const createWorkspace = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Workspace name is required');
  }

  const workspace = await Workspace.create({
    name,
    description,
    owner: req.user._id,
    members: [{
      user: req.user._id,
      role: 'owner'
    }]
  });

  await workspace.populate('members.user', 'name email avatar');

  res.status(201).json({ success: true, workspace });
});

// @desc    Get all workspaces for current user
// @route   GET /api/workspaces
const getWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await Workspace.find({
    'members.user': req.user._id
  }).populate('members.user', 'name email avatar')
    .populate('owner', 'name email avatar');

  res.json({ success: true, workspaces });
});

// @desc    Get single workspace
// @route   GET /api/workspaces/:workspaceId
const getWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.workspaceId)
    .populate('members.user', 'name email avatar')
    .populate('owner', 'name email avatar');

  res.json({ success: true, workspace });
});

// @desc    Update workspace
// @route   PUT /api/workspaces/:workspaceId
const updateWorkspace = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const workspace = await Workspace.findByIdAndUpdate(
    req.params.workspaceId,
    { name, description },
    { new: true, runValidators: true }
  ).populate('members.user', 'name email avatar');

  res.json({ success: true, workspace });
});

// @desc    Delete workspace
// @route   DELETE /api/workspaces/:workspaceId
const deleteWorkspace = asyncHandler(async (req, res) => {
  await Workspace.findByIdAndDelete(req.params.workspaceId);
  res.json({ success: true, message: 'Workspace deleted successfully' });
});

// @desc    Get workspace members
// @route   GET /api/workspaces/:workspaceId/members
const getMembers = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.workspaceId)
    .populate('members.user', 'name email avatar lastSeen');

  res.json({ success: true, members: workspace.members });
});

// @desc    Update member role
// @route   PUT /api/workspaces/:workspaceId/members/:userId/role
const updateMemberRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const workspace = req.workspace;

  const member = workspace.members.find(
    m => m.user.toString() === req.params.userId
  );

  if (!member) {
    res.status(404);
    throw new Error('Member not found');
  }

  if (member.role === 'owner') {
    res.status(400);
    throw new Error('Cannot change owner role');
  }

  member.role = role;
  await workspace.save();

  res.json({ success: true, message: 'Role updated successfully' });
});

// @desc    Remove member
// @route   DELETE /api/workspaces/:workspaceId/members/:userId
const removeMember = asyncHandler(async (req, res) => {
  const workspace = req.workspace;

  const member = workspace.members.find(
    m => m.user.toString() === req.params.userId
  );

  if (!member) {
    res.status(404);
    throw new Error('Member not found');
  }

  if (member.role === 'owner') {
    res.status(400);
    throw new Error('Cannot remove workspace owner');
  }

  workspace.members = workspace.members.filter(
    m => m.user.toString() !== req.params.userId
  );

  await workspace.save();
  res.json({ success: true, message: 'Member removed successfully' });
});

// @desc    Invite member
// @route   POST /api/workspaces/:workspaceId/invite
const inviteMember = asyncHandler(async (req, res) => {
  const { email, role = 'member' } = req.body;
  const workspace = req.workspace;

  // Check if already a member
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const isMember = workspace.members.find(
      m => m.user.toString() === existingUser._id.toString()
    );
    if (isMember) {
      res.status(400);
      throw new Error('User is already a member');
    }
  }

  // Generate invite token
  const inviteToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Remove existing invite for this email
  workspace.invites = workspace.invites.filter(i => i.email !== email);

  workspace.invites.push({ email, role, token: inviteToken, expiresAt });
  await workspace.save();

  // Send invite email
  const inviteUrl = `${process.env.CLIENT_URL}/invite/${inviteToken}`;
  await sendEmail({
    to: email,
    subject: `You're invited to ${workspace.name} on ProjectFlow`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">You're invited! 🎉</h2>
        <p>${req.user.name} has invited you to join <strong>${workspace.name}</strong> on ProjectFlow.</p>
        <a href="${inviteUrl}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">
          Accept Invitation
        </a>
        <p>This invite expires in 7 days.</p>
      </div>
    `
  });

  res.json({ success: true, message: `Invitation sent to ${email}` });
});

// @desc    Join workspace via invite token
// @route   POST /api/workspaces/join/:token
const joinWorkspace = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const workspace = await Workspace.findOne({
    'invites.token': token,
    'invites.expiresAt': { $gt: Date.now() }
  });

  if (!workspace) {
    res.status(400);
    throw new Error('Invalid or expired invite link');
  }

  const invite = workspace.invites.find(i => i.token === token);

  // Check if already a member
  const alreadyMember = workspace.members.find(
    m => m.user.toString() === req.user._id.toString()
  );

  if (alreadyMember) {
    res.status(400);
    throw new Error('You are already a member of this workspace');
  }

  workspace.members.push({
    user: req.user._id,
    role: invite.role
  });

  // Remove used invite
  workspace.invites = workspace.invites.filter(i => i.token !== token);
  await workspace.save();

  res.json({ success: true, message: 'Joined workspace successfully!', workspace });
});

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getMembers,
  updateMemberRole,
  removeMember,
  inviteMember,
  joinWorkspace
};