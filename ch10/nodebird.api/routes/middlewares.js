const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(403).send('로그인 필요');
    }
  };
  
  exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/');
    }
  };

  exports.verifyToken = (req, res, next) => {
      try{
          req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET); //토큰과 시크릿키 전달
          // 미들웨어간에 데이터 전달 
          return next();
      } catch (error){
          if (error.name === 'TokenExpiredError'){
              return res.status(419).json({
                  code: 419,
                  message: '토큰이 만료되었습니다',
              });
          }
          return res.status(401).json({
              code: 401,
              message: '유효하지 않은 토큰입니디',
          });
      }
  };

  exports.apiLimiter = new RateLimit({
        windowMs: 60 * 1000, //1분
        max: 10,
        delayMs: 0,
        handler(req,res) {
            res.status(this.statusCode).json({ //429
            code: this.statusCode,
            message: '1분에 한 번만 요청가능',
        })
    }      
  });

  exports.deprecated = (req, res) => {
      res.status(410).json({
          code:410,
          message: ' 새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
      })
  }