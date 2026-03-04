const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createProject);
router.get('/workspace/:workspaceId', protect, getProjects);
router.get('/:projectId', protect, getProject);
router.put('/:projectId', protect, updateProject);
router.delete('/:projectId', protect, deleteProject);
router.post('/:projectId/members', protect, addMember);
router.delete('/:projectId/members/:userId', protect, removeMember);
router.get('/:projectId/labels', protect, getLabels);
router.post('/:projectId/labels', protect, createLabel);
router.delete('/:projectId/labels/:labelId', protect, deleteLabel);

module.exports = router;