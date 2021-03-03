const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
    passport.use(new KakaoStrategy( {
        clientID: process.env.KAKAO_ID,
        callbackURL : '/auth/kakao/callback', //로그인성공시 갈 url
        
    }, async ( accessToken, refreshToken, profile, done) => { //카카오가 제공
        console.log('kakao profile', profile);
        try { // 카카오로 회원가입한게 있나 확인
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'kakao' },
            });
            if(exUser){ // 로그인
                done(null, exUser);
            } else { // 회원가입
                const newUser = await User.create({
                    email: profile._json && profile._json.kakao_account_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};

