const ForumPost = require('../models/ForumPost');

// @desc    Get all forum posts
// @route   GET /api/forum
// @access  Public
const getPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find({})
      .populate('user', 'name profileImage')
      .populate('comments.user', 'name')
      .sort('-createdAt');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get forum post by ID
// @route   GET /api/forum/:id
// @access  Public
const getPostById = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('user', 'name profileImage')
      .populate('comments.user', 'name profileImage');

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new post
// @route   POST /api/forum
// @access  Private
const createPost = async (req, res) => {
  const { title, description } = req.body;

  try {
    const post = await ForumPost.create({
      title,
      description,
      user: req.user._id,
    });

    const populatedPost = await ForumPost.findById(post._id).populate('user', 'name profileImage');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update own post
// @route   PUT /api/forum/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (post) {
      if (post.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to edit this post' });
      }

      post.title = req.body.title || post.title;
      post.description = req.body.description || post.description;

      const updatedPost = await post.save();
      const populated = await ForumPost.findById(updatedPost._id).populate('user', 'name profileImage');
      res.json(populated);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/forum/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (post) {
      if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this post' });
      }

      await post.deleteOne();
      res.json({ message: 'Post removed' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like or Unlike a post
// @route   POST /api/forum/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (post) {
      const alreadyLiked = post.likes.includes(req.user._id);

      if (alreadyLiked) {
        // Unlike
        post.likes = post.likes.filter((userId) => userId.toString() !== req.user._id.toString());
      } else {
        // Like
        post.likes.push(req.user._id);
      }

      await post.save();
      const updatedPost = await ForumPost.findById(post._id)
        .populate('user', 'name profileImage')
        .populate('comments.user', 'name profileImage');
      res.json(updatedPost);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Comment on a post
// @route   POST /api/forum/:id/comment
// @access  Private
const commentPost = async (req, res) => {
  const { comment } = req.body;

  try {
    const post = await ForumPost.findById(req.params.id);

    if (post) {
      const newComment = {
        user: req.user._id,
        comment,
      };

      post.comments.push(newComment);
      await post.save();

      const updatedPost = await ForumPost.findById(post._id)
        .populate('user', 'name profileImage')
        .populate('comments.user', 'name profileImage');

      res.status(201).json(updatedPost);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
};
