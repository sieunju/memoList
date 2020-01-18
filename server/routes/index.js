const express = require('express');
const router = express.Router();
const account = require('./accountRouter');
const contents = require('./contentsRouter');

router.use('/',account);     // 계정에 대한 Router
router.use('/',contents);   // 콘텐츠 (메모) 데이터 추가 및 리스트 페이지 관련 Router

module.exports = router;