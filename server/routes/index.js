const express = require('express');
const router = express.Router();
const account = require('./accountRouter');
const contents = require('./contentsRouter');


// router.use('/*',(req,res,next) => {
//     res.setHeader("Expires","-1");
//     res.setHeader("Cache-Control", "must-revalidate, private");
//     next();
// });

router.use('/',account);     // 계정에 대한 Router
router.use('/contents',contents);   // 콘텐츠 (메모) 데이터 추가 및 리스트 페이지 관련 Router

module.exports = router;