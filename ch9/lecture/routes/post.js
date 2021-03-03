const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');
const { nextTick } = require('process');

const router = express.Router();

try{
    fs.readdirSync('upload');
} catch (error) {
    console.error('upload 폴더가 없어 uploads 폴더를 생성합니다. ');
    fs.mkdirSync('upload'); // 업로드폴더 생성
}

// multer생성
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'upload/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname); // 확장자
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext );
            //파일이름에 작성일시까지 더해서 이름을 지어준다 똑같은 이름을 방지해서 
        },
    }),
    limits : { fileSize : 5 * 1024 * 1024 },
});

// 이미지를 받아오기 때문에 single이다 이때 'img' 가 클라이언트에서의 보내준 이름이다 
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` }); //이건 밑에 게시글 올릴때 같이 보내주라고 url넘겨주는것
});

// req.body에서 만 받아오기 때문에 (게시글) none이다
const upload2 = multer(); //게시물을 받아올 multer
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g); // 정규표현식 #으로시작해서 띄어쓰기 없고 #아닐때까지
        if(hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() },
                    })
                }),
            );
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch(error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;