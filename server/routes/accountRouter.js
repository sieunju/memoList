/**
 * 사용자 정보에 대한 정의 클래스
 * Created by hmju
 */
const express = require('express');
const dataModel = require('../models/accountModel');
const utils = require('../utils/commandUtil');

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
 * {
 *  "user_nm": "테스트",
 *  "user_id": "test",
 *  "user_pw": "1234"
 * }
 */
router.post('/api/signUp', (req, res) => {
    const body = req.body;
    console.log("Sign Up ID\t" + body.user_id);
    console.log("Sign Up Pw\t" + body.user_pw);
    dataModel.postUser(body);
    res.status(200);
    res.write('Account Register Success');
    res.end();
});

/**
 * ACCOUNT SIGN_IN: POST /api/signin
 * 
 * BODY SAMPLE: 
 * {
 *  "user_id": "test",
 *  "user_pw": "1234"
 * }
 * or 
 * HEADER 
 * {
 *  "login_key" : unique Token
 * }
 * ERROR CODE:
 *  400
 */
router.post('/api/signIn', (req, res) => {
    try {
        const loginKey = utils.reqInfo(req).loginKey
        console.log(req.body)
        dataModel.fetchUser(loginKey, req.body, function onMessage(err, rows) {
            console.log(rows)
            if (err) {
                res.status(400).send({
                    status: false,
                    errMsg: err
                }).end()
            } else {
                if (rows[0] != null) {
                    const json = new Object()
                    json.status = true
                    json.user_nm = rows[0].USER_NM
                    json.res_path = rows[0].RES_PATH
                    if(rows[0].LOGIN_KEY != null) {
                        json.login_key = rows[0].LOGIN_KEY
                    }

                    res.status(200).send(json).end()
                } else {
                    res.status(400).send({
                        status: false,
                        erroMsg: '유효하지 않은 값입니다.'
                    }).end()
                }
            }
        })
    } catch (err) {
        res.status(400).send({
            status: false,
            errMsg: err
        }).end()
    }
})
// [e] API

module.exports = router