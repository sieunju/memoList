
const express = require('express');
const app = express();
const port = 1001;

var bodyParser = require('body-parser');

const router = require('./router/route')(app);   // 라우터 설정
const path = require('path');
const view_dist = path.join(__dirname, '..', './frontend/views');
const css_dist = path.join(__dirname, '..', './frontend');

// 서버가 읽을 수 있도록 HTML 의 위치를 정의해줍니다. 
app.set('views', view_dist);
app.use(express.static(css_dist));

// 서버가 HTML 렌더링을 할 때, EJS엔진을 사용하도록 설정합니다. 
app.set('view engine', 'ejs'); 
app.engine('html', require('ejs').renderFile);

// 라우터
app.use('/',router);

// Server Listen Start
app.listen(port, function () {
    console.log('Server Start, Port: ' + port);
});



