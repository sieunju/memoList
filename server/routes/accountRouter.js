/**
 * 사용자 정보에 대한 정의 클래스
 * Created by hmju
 */
const express = require('express');
const dataModel = require('../models/accountModel');

const router = express.Router();
// 어짜피 나만 쓸거니까 회원가입 따윈 PASSSSSSSSS

// 기본 페이지도 로그인 페이지
router.get('/',(req,res) => {
    console.log("Login Page Enter " + req.path);
    res.render('login.html');
});

// 로그인 페이지 진입.
router.get('/login',(req,res) =>{
    console.log("Login Page Enter " + req.path);
    res.render('login.html');
});

/**
 * ACCOUNT SIGN_IN: POST /api/account/signin
 * BODY SAMPLE: {"userId": "test",
 * "userPw": "1234"}
 * ERROR CODE:
 *      104
 */
router.post('api/signin',(req,res) => {
    console.log("Sign In Path" + req.path);
});


module.exports = router