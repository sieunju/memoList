/**
 * 사용자 정보에 대한 정의 클래스
 * Created by hmju
 */
const express = require('express');
const dataModel = require('../models/accountModel');

const router = express.Router();
// 어짜피 나만 쓸거니까 회원가입 따윈 PASSSSSSSSS

// [s] Page 
// 기본 페이지도 로그인 페이지
router.get('/', (req, res) => {
    console.log("Login Page Enter " + req.path);
    res.render('login.html');
});

// 로그인 페이지 진입.
router.get('/login', (req, res) => {
    console.log("Login Page Enter " + req.path);
    res.render('login.html');
});

// 회원 가입 페이지 진입.
router.get('/signUp', (req, res) => {
    res.render('signUp.html');
});
// [e] Page

// [s] API 
/**
 * ACCOUNT SIGN UP POST /api/signUp
 * BODY SAMPLE: 
 * {"user_id": "test",
 * "user_pw": "1234"}
 */
router.post('/api/signUp', (req, res) => {
    const body = req.body;
    console.log("Sign Up ID\t" + body.user_id);
    console.log("Sign Up Pw\t" + body.user_pw);
    dataModel.addUser(body.user_id, body.user_pw);
    res.status(200);
    res.write('Account Register Success');
    res.end();
});

/**
 * ACCOUNT SIGN_IN: POST /api/signin
 * BODY SAMPLE: {"user_id": "test",
 * "user_pw": "1234"}
 * ERROR CODE:
 *      104
 */
router.post('/api/signin', (req, res) => {
    const body = req.body;
    console.log("Sign In Path " + req.path);
    console.log("Sign In Id\t" + body.user_id);
    console.log("Sign In Pw\t" + body.user_pw);
    dataModel.userCheck(body.user_id, body.user_pw, function onMessage(isSuccess, loginKey) {
        if (isSuccess) {
            console.log("Login Success " + loginKey);
            res.cookie("loginKey", loginKey, {
                maxAge: 600 * 60 * 1000
            });
            res.redirect('/memoList');
        } else {
            console.log("Error");
            res.status(404);
            res.end();
        }
    });
});
// [e] API

module.exports = router