const http = require('http');


const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
    res.write('<h1>Hello Node!</h1>');
    res.end('<h1>Hello Node!</h1>');
})

    .listen(8080);
server.on('listening', () => {  
    console.log('8080포트에서 서버 대기중 입니다.'); 
});

server.on('error', (error) => {
    console.log(error);
});