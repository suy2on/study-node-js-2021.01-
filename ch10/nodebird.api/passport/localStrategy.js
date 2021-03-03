const passport= require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.use(new localStrategy({
        usernameField: 'email', // req.body.email
        passwordField: 'password', // req.body. password
    }, async (email, password, done) => {
        try{
            const exUser = await User.findOne({ where : {email} });
            if(exUser){ // 찾으면 
                const result = await bcrypt.compare(password, exUser.password);
                if (result){ // 비번 일치하면
                    done(null, exUser);
                } else{ //비번틀리면
                    done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
                }
            } else{ //못찾으면
                done(null, false, {message: '가입되지 않은 회원입니다.'})
            }
        } catch (error){ //로그인시 오류나면 
            console.error(error);
            done(error);
        }
    }));
};
// done( 서버오류, 사용자, info )