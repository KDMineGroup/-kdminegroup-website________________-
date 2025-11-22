/**
 * Blog Routes
 */

const express = require('express');
const router = express.Router();
const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    getCategories,
    searchPosts,
    likePost,
    addComment,
} = require('../controllers/blog.controller');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getPosts);
router.get('/categories', getCategories);
router.get('/search', searchPosts);
router.get('/:id', getPost);

// Protected routes
router.post('/create', protect, authorize('admin', 'moderator'), createPost);
router.put('/:id', protect, authorize('admin', 'moderator'), updatePost);
router.delete('/:id', protect, authorize('admin', 'moderator'), deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);

module.exports = router;