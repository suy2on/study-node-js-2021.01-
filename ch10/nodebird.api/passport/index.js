const passport = require('passport');
const local = require('./localStrategy.js');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');


module.exports= () => { //req.login의 user가 여기쓰임
    passport.serializeUser((user, done) => {
        done(null, user.id); // 세션에 user의 id만 저장
    });
    // {id : 3, 'connect.sid': s%394847363738484}
    // session cookie 보고 id 알아내서 밑으로 넘김

    passport.deserializeUser((id, done) => { //req.user가 여기서 이제 만들어짐
        User.findOne({ where: {id},
            include: [{ //req.user에 팔로워 팔로잉 넣어주기
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers',
              }, {
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings',
              }], 
            })
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local();
    kakao();
};
