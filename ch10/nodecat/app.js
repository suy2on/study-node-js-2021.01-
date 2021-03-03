const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')
const session = require('express-session');

dotenv.config();
const indexRouter = require('./routes/index');

const app = express();
app.set('port', process.env.PORT || 4000 );
app.set('view engine', 'html'); // nunjucks
nunjucks.configure('views', {
    express: app,
    watch: true,
});

app.use(morgan('dev')) // 더 자세히 로그알려주는
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

app.use('/', indexRouter);

app.use((req, res, next) => {
    const error = new Error(` ${req.method} ${req.url} 라우터가 없습니다`);
    error.status= 404;
    next(error);
})

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500 ); // error status 거나 없으면 500
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
})
