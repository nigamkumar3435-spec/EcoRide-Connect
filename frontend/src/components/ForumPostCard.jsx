import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaCommentAlt, FaUserCircle } from 'react-icons/fa';

const ForumPostCard = ({ post, currentUserId, onLike }) => {
  const isLiked = post.likes && post.likes.includes(currentUserId);
  const commentCount = post.comments ? post.comments.length : 0;
  const postDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* User Info & Meta */}
      <div className="flex items-center gap-3">
        {post.user?.profileImage ? (
          <img
            src={post.user.profileImage}
            alt={post.user.name}
            className="w-8 h-8 rounded-full object-cover border border-emerald-500/20"
          />
        ) : (
          <FaUserCircle className="text-slate-500" size={32} />
        )}
        <div>
          <span className="text-sm font-semibold text-white block leading-tight">
            {post.user?.name || 'Anonymous'}
          </span>
          <span className="text-[10px] text-slate-500 block pt-0.5">{postDate}</span>
        </div>
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Link to={`/forum`} className="group block">
          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
          {post.description}
        </p>
      </div>

      <div className="border-t border-slate-900 pt-3 flex items-center justify-between">
        <div className="flex gap-4">
          {/* Like Button */}
          <button
            onClick={() => onLike(post._id)}
            className={`flex items-center gap-1.5 text-xs font-medium transition cursor-pointer ${
              isLiked ? 'text-rose-400' : 'text-slate-500 hover:text-rose-400'
            }`}
          >
            {isLiked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
            <span>{post.likes ? post.likes.length : 0} Likes</span>
          </button>

          {/* Comment Count */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <FaCommentAlt size={12} />
            <span>{commentCount} Comments</span>
          </div>
        </div>

        {/* View Details Link */}
        <Link
          to={`/forum`}
          className="text-xs font-semibold text-emerald-400 hover:underline"
        >
          Join Discussion
        </Link>
      </div>
    </div>
  );
};

export default ForumPostCard;
