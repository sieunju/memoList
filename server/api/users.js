/**
 * 사용자 정보에 대한 경로들을 정의한 클래스
 * 
 * Created on 2019.12.31 by hmju 
 */
const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.post('/register',controller.register);   // 회원 가입.
router.post('/login',controller.login);         // 로그인.
router.post('/logout',controller.logOut);       // 로그 아웃.
router.get('/idCheck',controller.idCheck);      // 아이디 중복성 체크

module.exports = router;
