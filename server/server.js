const express = require('express');
const app = express();
const path = require('path');
const api = require('./routes/index');

const port = 1001;

const view_dist = path.join(__dirname, '..', './client/views');
const public = path.join(__dirname, '..', './client'); 

// 서버가 읽을 수 있도록 HTML 의 위치를 정의해줍니다.  
app.set('views', view_dist);
app.use(express.static(public));

// 서버가 HTML 렌더링을 할 때, EJS엔진을 사용하도록 설정합니다. 
app.set('view engine', 'ejs'); 
app.engine('html', require('ejs').renderFile);

app.use(express.json());
/* use session */
// app.use(session({
//     secret: 'CodeLab1$1$234',
//     resave: false,
//     saveUninitialized: true
// }));

/* setup routers & static directory */
app.use('/', api);

/* handle error */
// app.use(function (err, req, res, next) {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

app.listen(port, () => {
    console.log('Server Start, Port: ' + port);
});
