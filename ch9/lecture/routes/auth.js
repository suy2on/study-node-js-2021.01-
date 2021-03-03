const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');


const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try{
        const exUser = await User.findOne({ where: {email} });
        if (exUser){
            return res.redirect('/join?error=exist'); //front에서 query보고 처리
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch(error){
        console.error(error);
        return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    //미들웨어 안에 미들웨어
    //두번재 인자는 done이 전달해줌
    passport.authenticate('local', (authError, user, info) => {
        if (authError){ // 에러인 경우
            console.error(authError);
            return next(authError);
        }
        if(!user){ //비번틀린경우나 eamil이 없는경우
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => { //passport index.js 로간다
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            //세션 쿠키를 브라우저로 보내준다 -> 로그인된 상태
            return res.redirect('/'); //로그인 성공
        });
    }) (req, res, next); //미들웨어 안에 미들웨어에는 끝날때 (req, res, next)붙입니다.

});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    return res.redirect('/');
})

//카카오 버튼 누르면 여기로 이동
router.get('/kakao', passport.authenticate('kakao')); 

//카카오로그인페이지에서 로그인후에 정보를 담아서 아래 url로 전송해줌
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});


module.exports = router;