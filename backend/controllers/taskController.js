const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');
const createNotification = require('../utils/createNotification');

// @desc    Create task
// @route   POST /api/tasks
const createTask = asyncHandler(async (req, res) => {
  const {
    title, description, projectId, workspaceId,
    sprintId, assignees, status, priority,
    labels, dueDate, estimatedHours
  } = req.body;

  if (!title || !projectId || !workspaceId) {
    res.status(400);
    throw new Error('Title, project and workspace are required');
  }

  const task = await Task.create({
    title,
    description,
    project: projectId,
    workspace: workspaceId,
    sprint: sprintId || null,
    assignees: assignees || [],
    status: status || 'todo',
    priority: priority || 'medium',
    labels: labels || [],
    dueDate: dueDate || null,
    estimatedHours: estimatedHours || 0,
    createdBy: req.user._id
  });

  await task.populate('assignees', 'name email avatar');
  await task.populate('createdBy', 'name email avatar');
  await task.populate('labels');

  // Notify assignees
  if (assignees && assignees.length > 0) {
    for (const assigneeId of assignees) {
      if (assigneeId !== req.user._id.toString()) {
        await createNotification({
          userId: assigneeId,
          type: 'task_assigned',
          title: 'New task assigned',
          message: `${req.user.name} assigned you to "${title}"`,
          link: `/tasks/${task._id}`,
          createdBy: req.user._id
        });
      }
    }
  }

  res.status(201).json({ success: true, task });
});

// @desc    Get tasks for project
// @route   GET /api/tasks/project/:projectId
const getProjectTasks = asyncHandler(async (req, res) => {
  const { status, priority, assignee, sprint, search } = req.query;

  let filter = {
    project: req.params.projectId,
    isArchived: false
  };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignee) filter.assignees = assignee;
  if (sprint) filter.sprint = sprint;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const tasks = await Task.find(filter)
    .populate('assignees', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .populate('labels')
    .populate('sprint', 'name status')
    .sort({ order: 1, createdAt: -1 });

  res.json({ success: true, tasks });
});

// @desc    Get my tasks
// @route   GET /api/tasks/my
const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    assignees: req.user._id,
    isArchived: false
  })
    .populate('assignees', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .populate('project', 'name color icon')
    .populate('labels')
    .sort({ dueDate: 1, createdAt: -1 });

  res.json({ success: true, tasks });
});

// @desc    Get single task
// @route   GET /api/tasks/:taskId
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId)
    .populate('assignees', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .populate('labels')
    .populate('sprint', 'name status')
    .populate('comments.author', 'name email avatar')
    .populate('subTasks.assignee', 'name email avatar');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({ success: true, task });
});

// @desc    Update task
// @route   PUT /api/tasks/:taskId
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.taskId,
    req.body,
    { new: true, runValidators: true }
  )
    .populate('assignees', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .populate('labels')
    .populate('sprint', 'name status');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({ success: true, task });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:taskId
const deleteTask = asyncHandler(async (req, res) => {
  await Task.findByIdAndDelete(req.params.taskId);
  res.json({ success: true, message: 'Task deleted successfully' });
});

// @desc    Update task status
// @route   PATCH /api/tasks/:taskId/status
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const task = await Task.findByIdAndUpdate(
    req.params.taskId,
    { status },
    { new: true }
  ).populate('assignees', 'name email avatar');

  if (status === 'done') {
    for (const assigneeId of task.assignees) {
      await createNotification({
        userId: assigneeId._id,
        type: 'task_completed',
        title: 'Task completed',
        message: `"${task.title}" has been marked as done`,
        link: `/tasks/${task._id}`,
        createdBy: req.user._id
      });
    }
  }

  res.json({ success: true, task });
});

// @desc    Add comment
// @route   POST /api/tasks/:taskId/comments
const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const task = await Task.findById(req.params.taskId);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  task.comments.push({
    author: req.user._id,
    content
  });

  await task.save();
  await task.populate('comments.author', 'name email avatar');

  // Notify task assignees
  for (const assigneeId of task.assignees) {
    if (assigneeId.toString() !== req.user._id.toString()) {
      await createNotification({
        userId: assigneeId,
        type: 'comment_added',
        title: 'New comment',
        message: `${req.user.name} commented on "${task.title}"`,
        link: `/tasks/${task._id}`,
        createdBy: req.user._id
      });
    }
  }

  const newComment = task.comments[task.comments.length - 1];
  res.status(201).json({ success: true, comment: newComment });
});

// @desc    Delete comment
// @route   DELETE /api/tasks/:taskId/comments/:commentId
const deleteComment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  task.comments = task.comments.filter(
    c => c._id.toString() !== req.params.commentId
  );

  await task.save();
  res.json({ success: true, message: 'Comment deleted' });
});

// @desc    Add subtask
// @route   POST /api/tasks/:taskId/subtasks
const addSubTask = asyncHandler(async (req, res) => {
  const { title, assignee } = req.body;

  const task = await Task.findById(req.params.taskId);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  task.subTasks.push({ title, assignee });
  await task.save();
  await task.populate('subTasks.assignee', 'name email avatar');

  const newSubTask = task.subTasks[task.subTasks.length - 1];
  res.status(201).json({ success: true, subTask: newSubTask });
});

// @desc    Update subtask
// @route   PUT /api/tasks/:taskId/subtasks/:subTaskId
const updateSubTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  const subTask = task.subTasks.id(req.params.subTaskId);
  if (!subTask) {
    res.status(404);
    throw new Error('Subtask not found');
  }

  Object.assign(subTask, req.body);
  await task.save();

  res.json({ success: true, subTask });
});

// @desc    Delete subtask
// @route   DELETE /api/tasks/:taskId/subtasks/:subTaskId
const deleteSubTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  task.subTasks = task.subTasks.filter(
    s => s._id.toString() !== req.params.subTaskId
  );

  await task.save();
  res.json({ success: true, message: 'Subtask deleted' });
});

// @desc    Search tasks
// @route   GET /api/tasks/search
const searchTasks = asyncHandler(async (req, res) => {
  const { q, workspaceId } = req.query;

  if (!q) {
    return res.json({ success: true, tasks: [] });
  }

  const tasks = await Task.find({
    workspace: workspaceId,
    title: { $regex: q, $options: 'i' },
    isArchived: false
  })
    .populate('project', 'name color icon')
    .populate('assignees', 'name email avatar')
    .limit(10);

  res.json({ success: true, tasks });
});

module.exports = {
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
};