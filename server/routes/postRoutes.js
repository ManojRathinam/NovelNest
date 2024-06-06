const { Router } = require('express');
const HttpError = require('../models/errorModel');
const { createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost, ratePost, generateAllSummaries } = require('../controllers/postControllers');
const authMiddleware = require('../middleware/authMiddleware');
const router = Router();

router.post('/', authMiddleware, createPost);
router.get('/', getPosts);
router.get('/summary/:id', async (req, res, next) => {
    try {
        // Get the post ID from request parameters
        const postId = req.params.id;
        
        // Call the function to get the post
        const post = await getPost(postId);

        // If the post exists, generate the summary
        if (post) {
            // Call the function to generate summary
            const summary = await generateSummary(post.description); // Assuming the post has a 'description' property

            // Send the summary as response
            res.json({ summary });
        } else {
            // If the post doesn't exist, send an error response
            throw new Error('Post not found');
        }
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Failed to generate summary', error: error.message });
    }
});
router.get('/:id', getPost);
router.patch('/:id', authMiddleware, editPost);
router.get('/categories/:category', getCatPosts);
router.get('/users/:id', getUserPosts);
router.delete('/:id', authMiddleware, deletePost);
router.post('/:id/rate', authMiddleware, ratePost);

module.exports = router;
