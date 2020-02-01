/**
 * 메모에 대한 API 클래스
 * Created by hmju
 */
const express = require('express');
const router = express.Router();
const dataModel = require('../models/contentModel');
const utils = require('../utils/commandUtil');

// [s] Page
// 메모 리스트 페이지
router.get('/memoList', (req, res) => {
    console.log("memoList Page Enter " + req.path);
    res.render('memoList.html');
});

// 메모 추가 페이지
router.get('/addMemo', (req, res) => {
    console.log("addMemo Page Enter " + req.path);
    res.render('addMemo.html');
})
// [e] Page

// [s] API
// 메모 추가.
router.post('/api/addMemo', (req, res) => {
    console.log(req.url,'AddMemo');
    const cookie = utils.cookieParser(req.headers.cookie);
    const loginKey = cookie.loginKey;
    console.log(req.headers.cookie);
    console.log("============================");
    console.log('Cookie ' + loginKey);
    // const body = req.body;
    // console.log("============BODY============");
    // console.log("Tag " + body.tag);
    // console.log("Title " + body.title);
    // console.log("Description " + body.description);
    // console.log("============BODY============");
    // console.log("============COOKIES============");
    // // console.log("LoginKey " + req.cookies.loginKey);
    // // console.log(req.cookies);
    // console.log("============COOKIES============");
    // // dataModel.addMemo("",body);
    res.end();
});
// [e] API

module.exports = router
