const http = require('http');
const fs = require('fs').promises;
const qs = require('querystring');
const url = require('url');

const parseCookies = (cookie = '') =>
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

const records = {};

http.createServer( async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
  try{
    console.log(cookies.name);
    if (req.method === 'GET'){
        if (cookies.name === undefined ) { // 첫화면은 로그인화면
            if(req.url === '/'){
            const data = await fs.readFile('./login.html');
            //헤더부분에 넣어줄 말들 , 200 : 정상응답
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            return res.end(data);
            } else if(req.url.startsWith('/login')) {
            console.log(req.url);
            const { query } = url.parse(req.url);
            const { name } = qs.parse(query);
            const expires = new Date();
            expires.setMinutes(expires.getMinutes() + 5);
            res.writeHead( 302, {
                Location: '/records',
                'Set-Cookie' :  `name = ${encodeURIComponent(name)}; Expires : ${expires.toGMTString()}; HttpOnly; Path=/records`,
                })
            res.end();
            }
            
          } else if (req.url === '/records') {
            const data = await fs.readFile('./home.html');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            return res.end(data);
          } else if (req.url === '/records') {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            return res.end(JSON.stringify(records));
          }  else {
            try {
                // 만약 이상한 요청이라면 여기에서 파일을 읽어오면서 오류 발생 그걸 catch(err)로 보낸다.
                const data = await fs.readFile(`.${req.url}`); // .\restFront.js 이런식으로
                return res.end(data);
              } catch (err) {
                // 주소에 해당하는 라우트를 못 찾았다는 404 Not Found error 발생
        
              }
            }
        } else if(req.method === 'POST') {
          if (req.url === '/records'){
            let body = '';
            req.on('data', (data) => {
              body += data;
            });
            return req.on('end' , () => {
              console.log('POST 본문 :' , body);
              console.log(typeof(body));
              const { record } = JSON.parse(body);
              const id = Data.now();
              user[id] = record;
              res.writeHead( 201, { 'Content-Type': 'text/plain; charset=utf-8' })
              return res.end('OK');
            });
          }
        } else if(req.method === 'PUT'){
            if (req.url.startsWith('/records/')){
              const key = req.url.split('/')[2];
              let body = '';
              req.on('data', (data) => {
                body += data;
              });
              return req.on('end', ()  => {
                console.log('PUT 본문 : ', body);
                records[key] = JSON.parse(body);
                res.writeHead( 200, { 'Content-Type': 'text/plain; charset=utf-8' })
                return res.end('OK');
              })
            }

        } else if(req.method === 'DELETE'){
          if (req.url.startsWith('/records/')){
            const key = req.url.split('/')[2];
            delete records[key];
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('ok');
          }
        }
        res.writeHead(404);
        return res.end('NOT FOUND');
      } catch (err){
        console.log(err);
        res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8' });
        res.end(err.message);
      }    
    })
    .listen(8087, () => {
      console.log('8087번 포트에서 서버 대기 중입니다.')
    })