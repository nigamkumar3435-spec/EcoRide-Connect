import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaComments, FaHeart, FaRegHeart, FaTrash, FaPen, FaPaperPlane, FaUserCircle } from 'react-icons/fa';

const Forum = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New post fields
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [postError, setPostError] = useState('');
  const [creating, setCreating] = useState(false);

  // Expanded comments tab
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Editing state
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/forum');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to load forum posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!newTitle.trim() || !newDescription.trim()) {
      return setPostError('Please add both a title and description');
    }

    setPostError('');
    setCreating(true);

    try {
      await axios.post('/api/forum', {
        title: newTitle,
        description: newDescription,
      });
      setNewTitle('');
      setNewDescription('');
      fetchPosts();
    } catch (err) {
      setPostError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setCreating(false);
    }
  };

  const handleLike = async (postId) => {
    if (!user) return navigate('/login');
    try {
      const res = await axios.post(`/api/forum/${postId}/like`);
      // Update local state for likes
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, likes: res.data.likes } : p))
      );
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!newCommentText.trim()) return;

    try {
      const res = await axios.post(`/api/forum/${postId}/comment`, {
        comment: newCommentText,
      });
      setNewCommentText('');
      // Update the comments for this specific post
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, comments: res.data.comments } : p))
      );
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this forum post permanently?')) return;
    try {
      await axios.delete(`/api/forum/${postId}`);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleStartEdit = (post) => {
    setEditingPostId(post._id);
    setEditTitle(post.title);
    setEditDescription(post.description);
  };

  const handleSaveEdit = async (e, postId) => {
    e.preventDefault();
    try {
      await axios.put(`/api/forum/${postId}`, {
        title: editTitle,
        description: editDescription,
      });
      setEditingPostId(null);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update post');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-screen">
      
      {/* Left panel: Discussions */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FaComments className="text-emerald-400" /> Community Forum
          </h1>
          <p className="text-xs text-slate-400">Discuss electric vehicles, share ranges, and seek assistance from other owners</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-44 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-panel text-center py-16 rounded-3xl">
            <p className="text-sm text-slate-500 italic">No posts in the forum yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const isOwner = user && post.user?._id === user._id;
              const isAdmin = user && user.role === 'admin';
              const isLiked = user && post.likes?.includes(user._id);
              const postDate = new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div key={post._id} className="glass-panel p-5 rounded-2xl space-y-4">
                  {editingPostId === post._id ? (
                    /* Edit Form */
                    <form onSubmit={(e) => handleSaveEdit(e, post._id)} className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                        required
                      ></textarea>
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setEditingPostId(null)}
                          className="px-3 py-1.5 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-xs"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Post Content */
                    <>
                      <div className="flex justify-between items-start">
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
                            <span className="text-xs font-semibold text-white block">
                              {post.user?.name || 'Anonymous'}
                            </span>
                            <span className="text-[10px] text-slate-500 block pt-0.5">{postDate}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        {(isOwner || isAdmin) && (
                          <div className="flex gap-2">
                            {isOwner && (
                              <button
                                onClick={() => handleStartEdit(post)}
                                className="text-slate-500 hover:text-emerald-400 p-1"
                              >
                                <FaPen size={11} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeletePost(post._id)}
                              className="text-slate-500 hover:text-rose-400 p-1"
                            >
                              <FaTrash size={11} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-white">{post.title}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{post.description}</p>
                      </div>

                      <div className="border-t border-slate-900 pt-3 flex items-center justify-between">
                        <div className="flex gap-6">
                          <button
                            onClick={() => handleLike(post._id)}
                            className={`flex items-center gap-1.5 text-xs font-medium cursor-pointer transition ${
                              isLiked ? 'text-rose-400' : 'text-slate-500 hover:text-rose-400'
                            }`}
                          >
                            {isLiked ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
                            <span>{post.likes?.length || 0} Likes</span>
                          </button>

                          <button
                            onClick={() =>
                              setActiveCommentsPostId(
                                activeCommentsPostId === post._id ? null : post._id
                              )
                            }
                            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-400 transition"
                          >
                            <FaComments size={13} />
                            <span>{post.comments?.length || 0} Comments</span>
                          </button>
                        </div>
                      </div>

                      {/* Comments Drawer */}
                      {activeCommentsPostId === post._id && (
                        <div className="mt-4 border-t border-slate-900 pt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                          <div className="space-y-3 pl-4 border-l border-slate-800">
                            {post.comments?.map((c) => (
                              <div key={c._id} className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-950 space-y-1">
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                                  <span>{c.user?.name || 'Anonymous'}</span>
                                  <span className="text-slate-600">•</span>
                                  <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-xs text-slate-300">{c.comment}</p>
                              </div>
                            ))}
                          </div>

                          {/* Write Comment */}
                          {user ? (
                            <form
                              onSubmit={(e) => handleCommentSubmit(e, post._id)}
                              className="flex gap-2"
                            >
                              <input
                                type="text"
                                placeholder="Write a response..."
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                                required
                              />
                              <button
                                type="submit"
                                className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl transition cursor-pointer"
                              >
                                <FaPaperPlane size={12} />
                              </button>
                            </form>
                          ) : (
                            <p className="text-[10px] text-slate-500 italic pl-4">
                              Please login to comment on this post.
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right panel: Add Post Form */}
      <div className="lg:col-span-1">
        <div className="glass-panel p-6 rounded-3xl space-y-5 sticky top-24">
          <h2 className="text-base font-bold text-white uppercase tracking-wider">Start a Thread</h2>
          
          <div className="border-t border-slate-900 my-2"></div>

          {postError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-2.5 rounded-xl text-xs">
              {postError}
            </div>
          )}

          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400">Discussion Title</label>
              <input
                type="text"
                placeholder="What would you like to ask?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400">Detailed Description</label>
              <textarea
                placeholder="Describe your context or questions in detail..."
                rows={5}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              {creating ? 'Publishing...' : 'Publish Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Forum;
