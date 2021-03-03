const express = require('express');
const axios = require('axios');

const router = express.Router();
const URL = 'http://localhost:8002/v2';

axios.defaults.headers.origin = 'http://localhost:4000'; // origin header 추가

const request = async (req, api )=> {
    try{
        if (!req.session.jwt){ // 토큰없으면 생성
            const tokenResult = await axios.post(`${URL}/token`, {
                clientSecret: process.env.CLIENT_SECRET,
            });
            req.session.jwt = tokenResult.data.token; // 생성성공   
            console.log('성공')       
        }
        return await axios.get(`${URL}${api}`, {
            headers: { authorization: req.session.jwt },
        }); //api요청보내기, 헤더에 토큰넣어서
    } catch (error){
        if(error.response.status === 419 ){ //토큰만료시
            delete req.session.jwt;
            return request(req,api);
        }
        return error.response;
    }
};

router.get('/mypost', async (req, res, next) => {
    try{
        const result = await request(req, '/posts/my');
        res.json(result.data);
    } catch(error){
        console.error(error);
        next(error);
    }
});

router.get('/search/:hashtag', async (req, res, next) => {
    try{
        const result = await request(req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`);
        res.json(result.data);

    } catch(error){
        console.error(error);
        next(error);
    }
});

router.get('/', (req, res) => {
    res.render('main', { key: process.env.CLIENT_SECRET}) // 원래 브라우저용 키를 줘야함
});

module.exports = router;