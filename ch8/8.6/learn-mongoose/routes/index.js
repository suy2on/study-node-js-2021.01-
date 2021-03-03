const express = require('express');
const User = require('../schemas/user');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const users = await User.find({});
        res.render('mongoose', { users }); //html을 보여주면서 users 넘긴다
    } catch (err){
        console.error(err);
        next(err);
    }
});

module.exports = router;