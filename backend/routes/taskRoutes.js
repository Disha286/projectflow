const express = require('express');
const router = express.Router();
const {
  createTask,
  getProjectTasks,
  getMyTasks,
  getTask,
  updateTask,
  deleteTask,
  updateStatus,
  addComment,
  deleteComment,
  addSubTask,
  updateSubTask,
  deleteSubTask,
  searchTasks
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createTask);
router.get('/my', protect, getMyTasks);
router.get('/search', protect, searchTasks);
router.get('/project/:projectId', protect, getProjectTasks);
router.get('/:taskId', protect, getTask);
router.put('/:taskId', protect, updateTask);
router.delete('/:taskId', protect, deleteTask);
router.patch('/:taskId/status', protect, updateStatus);
router.post('/:taskId/comments', protect, addComment);
router.delete('/:taskId/comments/:commentId', protect, deleteComment);
router.post('/:taskId/subtasks', protect, addSubTask);
router.put('/:taskId/subtasks/:subTaskId', protect, updateSubTask);
router.delete('/:taskId/subtasks/:subTaskId', protect, deleteSubTask);

module.exports = router;