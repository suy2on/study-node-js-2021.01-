const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv')
const nunjucks = require('nunjucks');
dotenv.config();

const indexRouter = require('./routes');
const userRouter = require('./routes/user')

const app = express();

// 위에서 아래로 진행
// 1.세팅
app.set('port', process.env.PORT || 3000); //서버에 속성 추가 port는 3000
// 템플릿 엔진
// 1) pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); 
// 2) 넌적스
// app,set('view engine', 'html');
// nunjucks.configure('views', {
//     express: app,
//     watch: true,
// }) 


// 2.미들웨어

////서비스맞게 순서조정해줘야한다

app.use(morgan('dev')); // 요청 응답 기록 
//app.use(morgan('combined')); 더 정확하게 기록해줌 (ip, 시간, ...)

app.use('/', express.static(path.join(__dirname, 'public')));
//app.use('요청 경로', express.static('실제 경로'));
//존재한다면 클라이언트로 넘겨주고 거기서 끝 (사진이나, css 같은것들 넘겨준다.)

app.use(cookieParser(process.env.COOKIE_SECRET));// 인자넣어서 사인화
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
    },
    //name: 'connect.sid'
}))

app.use('/', indexRouter);
app.use('/user', userRouter);

const multer = require('multer');
const fs = require('fs');
const { userInfo } = require('os');

const upload = multer({
    storage: multer.diskStorage({
        destination(req,file, done){
            done(null, 'uploads/');
        }, // 저장장소
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() +ext);
        }, // 파일이름
    }),
    limits: {fileSize: 5 * 1024 * 1024}, // 크키제한
 });

app.get('/upload', (req, res) =>{
    res.sendFile(path.join(__dirname, 'multipart.html'));
})

app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file); //req.file에 저장된다
    res.send('ok');
}); // 1.single('form에서 name값에 해당하는 것') : 하나만 받아올때
// 2.'image multiple일때는 array('image')이고  req.files이다
// 3.image1, image2 .... 따로따로 할때는 fields([{name : image1}, {name : image2},...])
// req.files.image2
// 4.upload.none() 은 multipart 나 formdata로 받고 이미지는 안받을때 형식은 이렇게 오기때문에
// req.body.변수이름 이렇게 들어있음

app.use(express.json); // json보내줄때 
app.use(express.urlencoded({extended : true})) //req.body.변수 로 접근
// form보내줄 때 / true면 qs쓴다는말 / 이미지나 파일은 다른거로 처리 

/////

app.use((req, res, next) => {
    console.log('모든요청에 실행하고싶어요')
    next(); //밑으로 넘겨주는
})

app.use('/about', (req, res, next) => {
    console.log('모든요청에 실행하고싶어요')
    next(); // about에서만 실행되고 다음으로 넘어감
})

//여러미들웨어 연달아 장착
app.use('/about', (req, res, next) => {
    console.log('1요청에 실행하고싶어요')
    next(); 
}, (req, res, next) => {
    console.log('2요청에 실행하고싶어요')
    next(); 
}, (req, res, next) => {
    try{
        console.log(nonono);
    } catch (error){
        next(error); // 넥스트에 인수가 있다면 에러처리 미들웨어로 넘어감
    }
})


// 3. 라우터들 : 범위넓을수록 뒤로빼자
app.get('/', (req, res, next) => {

    req.cookies // 쿠키가져오기
    res.cookie('name', encodeURIComponent(name), {
        expires: new Date(),
        httpOnly: true,
        path: '/'
    }) //쿠키생성
    res.clearCookie('name', encodeURIComponent(name), {
        httpOnly: true,
        path: '/'
    }) //쿠키삭제

    res.sendFile(path.join(__dirname,'index.html'));
    if(false){
        next('route'); // 다음 라우터부터 url같은걸 찾겟지
    } else {
        next();
    }
}, (req, res) => {
    console.log('else에서 실행됩니다.')
});

app.get('/', (req, res, next) => {
    console.log('if에서 실행됩니다.')
    
});


app.get('/category/Javascripts', (req, res) =>{
    res.send(`hello javascripts`);
}) // 와일드카드보다 위로 (특정경우니까)

app.get('/category/:name', (req, res) =>{
    res.send(`hello ${req.params.name}`);
}) // url에전달되는것 변수처리하기

app.post('/', (req, res) => {
    res.send('hello express');
});

app.get('/about', (req, res) => {
    res.send('hello express');
});

// app.get('*', (req, res) =>{
//     res.send(`hello everyone`);
// }) // 모든 url받는다 이런건 밑으로 빼주기

// 4.에러처리미들웨어 : 보안상 사용자와 개발자에게 다르게 뜨게 하자

// 페이지 못찾았을때
app.use((req, res, next) => {
    res.status(404).send('404오류입니다')
}) // 여기서 숫자만 바꿔주면 클라이언트에게 사기?를 칠수있다..ㅎㅎ

// throw new Error()해줄때 여기로 온다
app.use((err, req, res, next) =>{
    console.log(err); //이건 콘솔창에 보여요
    res.send('에러가 났습니다 이건사용자에게 보여요')
})

app.listen(app.get('port'), () =>{
    console.log('익스프레스 서버 실행');
});
