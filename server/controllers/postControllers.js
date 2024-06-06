const Post = require('../models/postModel');
const User = require('../models/userModel');
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require('../models/errorModel');
const openai = require('openai');
const openaiApi = new openai.OpenAI(process.env.OPENAI_API_KEY);

/// ======================Create Post
//  POST: api/posts
// unprotected
const createPost = async (req, res, next) => {
    try {
        let { title, category, description } = req.body;
        if (!title || !category || !description || !req.files) {
            return next(new HttpError("Fill in all fields and choose thumbnail.", 422));
        }
        const { thumbnail } = req.files;

        // Check the file size
        if (thumbnail.size > 2000000) {
            return next(new HttpError("Thumbnail too big. File should be less than 2mb"));
        }

        let fileName = thumbnail.name;
        let splittedFilename = fileName.split('.');
        let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
        thumbnail.mv(path.join(__dirname, '..', '/uploads', newFilename), async (err) => {
            if (err) {
                return next(new HttpError(err));
            } else {
                // Generate summary
                const summary = await generateSummary(description);

                const newPost = await Post.create({
                    title, 
                    category, 
                    description, 
                    thumbnail: newFilename,
                    creator: req.user.id,
                    summary: summary // Save summary to the database
                });

                if (!newPost) {
                    return next(new HttpError("Post couldn't be created.", 422));
                }

                // Find user and increase post count by 1
                const currentUser = await User.findById(req.user.id);
                const userPostCount = currentUser.posts + 1;
                await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

                res.status(201).json(newPost);
            }
        });
        
    } catch (error) {
        return next(new HttpError(error));
    }
};


/// ======================Get all Posts
// GET: api/posts
// protected
const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ updatedAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error));
    }
};

/// ======================Get single post
// GET: api/posts/:id
// protected
const getPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return next(new HttpError("Post not found.", 404));
        }
        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError(error));
    }
};

/// ======================Get Posts by Category
// GET: api/posts/categories/:category
// unprotected
const getCatPosts = async (req, res, next) => {
    try {
        const { category } = req.params;
        const catpost = await Post.find({ category }).sort({ createdAt: -1 });
        res.status(200).json(catpost);
    } catch (error) {
        return next(new HttpError(error));
    }
};

/// ======================Get User/Author Post
// GET: api/posts/users/:id
// unprotected
const getUserPosts = async (req, res, next) => {
    try {
        const { id } = req.params;
        const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error));
    }
};

/// ======================Edit Post
// PATCH: api/posts/:id
// protected
const editPost = async (req, res, next) => {
    try {
        let fileName;
        let newFilename;
        let updatedPost;
        const postId = req.params.id;
        let { title, category, description } = req.body;

        if (!title || !category || description.length < 12) {
            return next(new HttpError("Fill all the fields.", 422))
        }
        if (!req.files) {
            updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true })
        } else {
            //get old post from database
            const oldPost = await Post.findById(postId);
            //delete old thumbnail from upload
            if (oldPost.thumbnail) {
                fs.unlinkSync(path.join(__dirname, '..', 'uploads', oldPost.thumbnail)); // Fix here
            }
            const { thumbnail } = req.files;
            // check file size
            if (thumbnail.size > 2000000) {
                return next(new HttpError("Thumbnail too big. Should bre less than 2mb"))
            }
            fileName = thumbnail.name;
            let splittedFilename = fileName.split('.')
            newFilename = splittedFilename[0] + uuid() + '.' + splittedFilename[splittedFilename.length - 1]
            thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
                if (err) {
                    return next(new HttpError(err))
                }
            })

            updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description, thumbnail: newFilename }, { new: true })

        }

        if (!updatedPost) {
            return next(new HttpError("Couldn't update post.", 400))
        }
        res.status(200).json(updatedPost)
    } catch (error) {
        return next(new HttpError(error))
    }
};

/// ======================Delete Post
// DELETE: api/posts/:id
// protected
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        if (!postId) {
            return next(new HttpError("Post unavailable.", 400))
        }
        const post = await Post.findById(postId);
        const fileName = post?.thumbnail;
        //delete thumbnail from upload folder
        if (fileName) {
            fs.unlinkSync(path.join(__dirname, '..', 'uploads', fileName)); // Fix here
        }
        await Post.findByIdAndDelete(postId);
        // find user and reduce post count by 1
        const currentUser = await User.findById(req.user.id);
        const userPostCount = currentUser?.posts - 1;
        await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
        
        res.json(`Post ${postId} deleted successfully.`);
    } catch (error) {
        return next(new HttpError(error));
    }
};

// Function to generate summary for a single post
const generateSummary = async (description) => {
    try {
        const response = await openaiApi.complete({
            engine: 'text-davinci-003',
            prompt: `Summarize the following text:\n${description}\n\nSummary:`,
            maxTokens: 100,
            temperature: 0.7,
            topP: 1,
            frequencyPenalty: 0,
            presencePenalty: 0
        });

        const summary = response.data.choices[0].text.trim();
        return summary;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error('Failed to generate summary.');
    }
};

// ======================Rate Post
const ratePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return next(new HttpError("Invalid rating. Rating must be between 1 and 5.", 400));
        }

        const post = await Post.findById(postId);
        if (!post) {
            return next(new HttpError("Post not found.", 404));
        }

        post.rating = rating;
        await post.save();

        // Return updated post with rating
        res.status(200).json({ message: "Post rated successfully.", post });
    } catch (error) {
        return next(new HttpError(error));
    }
};


module.exports = { 
    createPost, 
    getPosts, 
    getPost, 
    getCatPosts, 
    getUserPosts, 
    editPost, 
    deletePost,
    generateSummary,
    ratePost
};

