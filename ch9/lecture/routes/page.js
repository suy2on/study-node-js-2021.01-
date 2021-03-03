//page를 보여주는 라우터들의 모임
const express = require('express');
const { Post, User, Hashtag } = require('../models');
const { post } = require('./auth');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user; // 현재 user는 공통으로 필요하기 때문에 여기서 넣어주기
    res.locals.followerCount = req.user ? req.user.Followers.length : 0; 
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
    if(req.user){
        console.log(req.user.Followings.map(f => f.id))
    }
    next();
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', async (req, res, next) => {
    try{
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [[ 'createdAt', 'DESC']],
        });
        res.render('main', {
            title: 'NodeBird',
            twits : posts,
        });
    } catch(err){
        console.error(err);
        next(err);
    }
})

router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title:query } });
        let posts = [];
        if(hashtag) {
            posts = await hashtag.getPosts({ include: [{ model: User }] });
        }

        return res.render('main', {
            title: `$(query) | NodeBird`,
            twits: posts,
        });
    } catch (error){
        console.error(error);
        next(error);
    }
})

module.exports = router;