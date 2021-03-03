const express = require('express');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const path = require('path')
const session = require('express-session')
const nunjucks = require('nunjucks')
const dotenv = require('dotenv')
const passport = require('passport');

dotenv.config(); // 이때부터 process.env에 적용된다
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const { sequelize } =require('./models');
const { resourceUsage } = require('process');
const passportConfig = require('./passport');
const { post } = require('./routes/page');

const app = express();
app.set('port', process.env.PORT || 8001); //개발시에는 8001번 포트
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

//db연결
sequelize.sync({ force: false }) //모델수정시 force:true로바꿔서 실행하면 테이블 데이터 지우고 다시생성 : 실무에선 사용 xx
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

passportConfig(); // passport/ index.js 실행

app.use(morgan('dev')); // 자세히 로그보여주기
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img',express.static(path.join(__dirname, 'upload'))); // '/img'를 이름으로 온건 uploads에서 가져가라
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //body parser가 못하는거 multer가 해줌
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
})); // 세션생성
   
app.use(passport.initialize());
app.use(passport.session()); //이거 이후로 req.user 하면 사용자가 나옴

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err: {};
    res.status(err.status || 500);
    res.render('error');
})

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기중');
});
