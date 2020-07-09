const express = require('express');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const app = express();
// [s] Environment Variable
const dotenv = require('dotenv');
dotenv.config();
// [e] Environment Variable
const https = require('https');
const fs = require('fs');
const path = require('path');
const serveStatic = require('serve-static');      //특정 폴더의 파일들을 특정 패스로 접근할 수 있도록 열어주는 역할
const api = require('./routes/index');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('./db/db_config');
const cors = require('cors'); //다중 서버로 접속하게 해주는 기능을 제공, 다른 ip 로 다른서버에 접속

// 폴더 경로 설정.
const view_dist = path.join(__dirname, '..', './client/views');
const public = path.join(__dirname, '..', './client');

// 서버가 읽을 수 있도록 HTML 의 위치를 정의해줍니다.  
app.set('views', view_dist);                                        // Web Client Resource
app.use(express.static(public));                                    // Web Client Resource
app.use('/resource', serveStatic(path.join(__dirname, 'resource')));  // Upload File Resource.

// 서버가 HTML 렌더링을 할 때, EJS엔진을 사용하도록 설정합니다. 
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

const morgan = require('morgan')
const winston = require('./utils/winston')

app.use(morgan('combined', { stream: winston.stream }));

// Json Body Parser
app.use(bodyParser.urlencoded({ extended: true })); // 웹에서 API Call
app.use(express.json());                            // API Call 할때.
app.use('/', api);                                  // 라우터 경로 세팅
app.use(cookieParser(process.env.COOKIE_KEY));      // 쿠키 세팅

// 다중 접속을 위한 미들 웨어
app.use(cors());

// 세션 사용
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new fileStore()
}));

// DB 세팅.
mysql.init();

// Http 에러 로그 생성 및 Http 에러 발생시 로그 저장 처리
// const logger = require('./utils/Logger')
// const morgan = require('morgan')
// app.use(
//   morgan('combined',
//   {
//     skip: function(req,res) {
//       console.log("Combined \t" + res.statusCode)
//       res.statusCode < 400
//     } , // http retrun 이 에러일때만 출력 200~ 399 정상.
//     stream: logger.stream // logger 에서 morgan의 stream 을 받도록 추가.
//   })
// );
// app.use(
//   morgan('combined',{stream : logger.stream})
// )


// Handle Error Setting
// app.use(function (err, req, res, next) {
//   logger.log('info','Handle Error\t'+err);
//   next(err);
// });
// app.use(function (err, req, res, next) {
//   res.status(err.status || 500);
//   res.send(err.message || 'Error!!');
// });

/**
 * 디렉토리 체크 로직
 * @param {*} path 
 * @param {*} callback 
 */
const checkDir = (path, callback) => {
  fs.stat(path, (err, stats) => {
    if (err && err.code === 'ENOENT')
      return callback(null, true);
    if (err)
      return callback(err);

    return callback(null, !stats.isDirectory());
  });
}

// 파일 업로드 관련 폴더 생성 및 체크
const resPath = './resource'
checkDir(resPath, (err, isTrue) => {
  if (err)
    return console.log(err);

  if (!isTrue) {
    console.log('이미 동일한 디렉토리가 있습니다. 패스 합니다.');
  }

  fs.mkdir(resPath, (err) => {
    if (err)
      console.log(err);

    console.log(`${resPath} 경로로 디렉토리를 생성했습니다.`);
  });
});

// 릴리즈 모드
if (process.env.BUILD_TYPE == 'RELEASE') {
  // Server Start.. && SSL 세팅.
  https.createServer({
    key: fs.readFileSync('./ssl/privkey.pem'),
    cert: fs.readFileSync('./ssl/cert.pem'),
    ca: fs.readFileSync('./ssl/chain.pem')
  }, app).listen(process.env.PORT, () => {
    console.log('Release Https Server Start, Port: ' + process.env.PORT);
  });

  // redirect http -> https
  const http = require('http');
  const httpApp = express();
  const httpPort = 100;
  httpApp.all('*', (req, res, next) => {
    res.redirect('https://' + req.hostname + ':' + process.env.PORT);
  });
  http.createServer(httpApp).listen(httpPort, () => {
    console.log('Http Server Start, Port: ' + httpPort);
  });
}
// 개발 모드
else {
  const http = require('http');
  http.createServer(app).listen(process.env.PORT, () => {
    console.log('Dev Http Server Start, Port: ' + process.env.PORT);
  })
}



