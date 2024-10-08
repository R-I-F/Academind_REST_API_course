const express = require('express'); 
const router = express.Router();
const feedController = require('../controllers/feed')
const {check, body} = require('express-validator');
const isAuth = require('../middleware/is-auth');


//  GET     /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

//  POST    /feed/post
router.post('/post', [
    body('title')
        .trim()
        .isLength({min: 5}),
    body('content')
        .trim()
        .isLength({min: 5}),
], isAuth, feedController.createPost);

router.get('/post/:postId', isAuth, feedController.getPost);

router.put('/post/:postId', [
    body('title')
        .trim()
        .isLength({min: 5}),
    body('content')
        .trim()
        .isLength({min: 5}),
], isAuth, feedController.updatePost);

router.delete('/post/:postId', isAuth,feedController.deletePost);

module.exports = router ; 