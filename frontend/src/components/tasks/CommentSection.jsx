import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { addCommentAPI, deleteCommentAPI } from '../../api/tasks';
import useAuthStore from '../../store/authStore';

const CommentSection = ({ task }) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [comment, setComment] = useState('');

  const { mutate: addComment, isPending } = useMutation({
    mutationFn: (data) => addCommentAPI(task._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', task._id]);
      setComment('');
    }
  });

  const { mutate: deleteComment } = useMutation({
    mutationFn: (commentId) => deleteCommentAPI(task._id, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', task._id]);
    }
  });

  return (
    <div>
      <h4 className="text-white font-medium text-sm mb-4">
        Comments
        {task.comments?.length > 0 && (
          <span className="ml-2 text-gray-400 font-normal">{task.comments.length}</span>
        )}
      </h4>

      {/* Comment input */}
      <div className="flex gap-3 mb-6">
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {user?.name?.[0]}
        </div>
        <div className="flex-1">
          <textarea
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
          />
          {comment.trim() && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => addComment({ content: comment.trim() })}
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
              >
                {isPending ? 'Posting...' : 'Post comment'}
              </button>
              <button
                onClick={() => setComment('')}
                className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {task.comments?.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">No comments yet. Be the first to comment!</p>
        )}
        {task.comments?.map((c) => (
          <div key={c._id} className="flex gap-3 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {c.author?.name?.[0] || 'U'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white text-sm font-medium">{c.author?.name}</span>
                <span className="text-gray-500 text-xs">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{c.content}</p>
            </div>
            {c.author?._id === user?._id && (
              <button
                onClick={() => deleteComment(c._id)}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all self-start mt-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;