import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';

const BlogCard = ({ blog }) => {
  const displayImage =
    blog.image || '/images/blog_cars_2026.png';
  
  const postDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Blog Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={displayImage}
          alt={blog.title}
          className="w-full h-full object-cover transition duration-500 hover:scale-105"
        />
        {/* Category Tag */}
        <span className="absolute top-3 left-3 bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
          {blog.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Date */}
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <FaCalendarAlt size={10} />
            <span>{postDate}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
            {blog.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {blog.content}
          </p>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-900 pt-3 transition-colors duration-300">
          <Link
            to={`/blogs/${blog._id}`}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline flex items-center gap-1"
          >
            Read Article &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
