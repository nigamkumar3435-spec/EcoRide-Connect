import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaCalendarAlt, FaTag } from 'react-icons/fa';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error('Failed to load blog detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-450"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center gap-4 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Blog Article Not Found</h2>
        <Link to="/blogs" className="text-emerald-600 dark:text-emerald-450 hover:underline text-xs flex items-center gap-1">
          <FaArrowLeft size={10} /> Back to Blogs
        </Link>
      </div>
    );
  }

  const postDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6 min-h-screen">
      <Link to="/blogs" className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 w-fit">
        <FaArrowLeft size={10} /> Back to Blogs Directory
      </Link>

      <article className="glass-panel overflow-hidden rounded-3xl space-y-6 pb-12">
        {/* Banner */}
        <div className="h-96 w-full relative">
          <img
            src={blog.image || '/images/blog_cars_2026.png'}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mb-3 inline-block">
              {blog.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
              {blog.title}
            </h1>
          </div>
        </div>

        {/* Content & Meta */}
        <div className="px-6 md:px-12 space-y-6">
          <div className="flex items-center gap-6 text-xs text-slate-500 border-b border-slate-200 dark:border-slate-900 pb-4">
            <span className="flex items-center gap-1.5">
              <FaCalendarAlt /> {postDate}
            </span>
            <span className="flex items-center gap-1.5">
              <FaTag /> {blog.category}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Author: EcoRide Editorial</span>
          </div>

          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line font-light">
            {blog.content}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
