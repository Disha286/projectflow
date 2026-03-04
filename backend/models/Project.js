const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    default: ''
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['manager', 'member', 'viewer'],
      default: 'member'
    }
  }],
  color: {
    type: String,
    default: '#6366f1'
  },
  icon: {
    type: String,
    default: '📁'
  },
  type: {
    type: String,
    enum: ['software', 'marketing', 'design', 'general'],
    default: 'general'
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'completed'],
    default: 'active'
  },
  startDate: Date,
  endDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);