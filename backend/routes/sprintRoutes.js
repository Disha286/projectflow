const express = require('express');
const router = express.Router();
const {
  createSprint,
  getSprints,
  getSprint,
  updateSprint,
  startSprint,
  completeSprint,
  deleteSprint
} = require('../controllers/sprintController');
const { protect } = require('../middleware/authMiddleware');

router.post('/project/:projectId', protect, createSprint);
router.get('/project/:projectId', protect, getSprints);
router.get('/:sprintId', protect, getSprint);
router.put('/:sprintId', protect, updateSprint);
router.post('/:sprintId/start', protect, startSprint);
router.post('/:sprintId/complete', protect, completeSprint);
router.delete('/:sprintId', protect, deleteSprint);

module.exports = router;