const express = require('express');
const router = express.Router();
const account = require('./accountRouter');
const contents = require('./contentsRouter');
const mobileApp = require('./appMobileRouter');
const upload = require('./uploadRouter');

router.use('/',account);        // 계정에 대한 Router
router.use('/',contents);       // 콘텐츠 (메모) 데이터 추가 및 리스트 페이지 관련 Router
router.use('/',mobileApp);      // 모바일 앱 관련 Router
router.use('/',upload);         // 파일 업로드 관련 

module.exports = router;