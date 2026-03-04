const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/workspaceController');
const { protect } = require('../middleware/authMiddleware');
const { isMember, isAdmin, isOwner } = require('../middleware/roleMiddleware');

router.post('/', protect, createWorkspace);
router.get('/', protect, getWorkspaces);
router.post('/join/:token', protect, joinWorkspace);
router.get('/:workspaceId', protect, isMember, getWorkspace);
router.put('/:workspaceId', protect, isAdmin, updateWorkspace);
router.delete('/:workspaceId', protect, isOwner, deleteWorkspace);
router.get('/:workspaceId/members', protect, isMember, getMembers);
router.put('/:workspaceId/members/:userId/role', protect, isAdmin, updateMemberRole);
router.delete('/:workspaceId/members/:userId', protect, isAdmin, removeMember);
router.post('/:workspaceId/invite', protect, isAdmin, inviteMember);

module.exports = router;