const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment text'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ForumPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a post title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add post description'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [CommentSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ForumPost', ForumPostSchema);
