import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('/api/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error('Failed to load blogs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const categories = ['EV News', 'Charging Tips', 'Government Policies', 'Battery Maintenance'];

  const filteredBlogs = category
    ? blogs.filter((b) => b.category === category)
    : blogs;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">EV Blogs & News</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Stay informed with the latest electric vehicle updates, maintenance guidelines, and policies</p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              category === ''
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                category === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="glass-panel text-center py-16 rounded-3xl">
          <p className="text-sm text-slate-500 italic">No articles published in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;
