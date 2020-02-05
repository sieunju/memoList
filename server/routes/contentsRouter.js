/**
 * 메모에 대한 API 클래스
 * Created by hmju
 */
const express = require('express');
const router = express.Router();
const dataModel = require('../models/contentModel');
const utils = require('../utils/commandUtil');
const fs = require('fs');

// [s] Page

/**
 * 사용자에 맞게 리스트 가져오기.
 * loginKey,
 * query {
 *  pageNo {페이지 Index}
 * }
 */
router.get('/memoList', (req, res) => {
    console.log(req.url, 'MemoList Page')
    const cookie = utils.cookieParser(req.headers.cookie);
    const loginKey = cookie.loginKey;
    req.query.pageNo = 0;
    let pageNo = req.query.pageNo;
    pageNo += 20;
    let options = {
        "pageNo": pageNo,
        "ttt": 11
    };
    dataModel.getMemo(loginKey, req.query, function onMessage(err, rows) {
        if (err) {
            console.log(req.url, err);
        }
        // Query 정상 동작 한경우.
        else {
            res.render('memoList.html',{
                title:'Memo...',
                dataList:rows,
                option:options
            });

            // res.render('memoList.html');
        
            // res.send({
            //     data:rows,
            //     pasing:options
            // });
            // fs.readFileSync('memoList.html', 'utf-8', function (err, data) {
            //     if (err) {
            //         console.log(req.url, 'Ejs Error' + err);
            //         return;
            //     }

            //     console.log('222222222??');
            //     res.send(ejs.render(data, {
            //         data: rows,
            //         pasing: options
            //     }));
            // });
        }
    })
});

// 메모 추가 페이지
router.get('/addMemo', (req, res) => {
    console.log("addMemo Page Enter " + req.path);
    res.render('addMemo.html');
})
// [e] Page

// [s] API
/**
 * 메모 추가.
 * loginKey,
 * body {
 *  tag             {우선 순위 값}
 *  title           {제목}
 *  description     {내용}
 * }
 */
router.post('/api/addMemo', (req, res) => {
    console.log(req.url, 'AddMemo');
    // 쿠키값 파싱.
    const cookie = utils.cookieParser(req.headers.cookie);
    const loginKey = cookie.loginKey;
    console.log(req.headers.cookie);
    console.log("============================");
    console.log(req.url, 'Cookie ' + loginKey);
    console.log(req.url, req.body);
    console.log("============================");
    dataModel.addMemo(loginKey, req.body);
    // 메인 페이지로 이동 ? 리프레쉬?
    res.redirect('/memoList');
});

/**
 * 사용자에 맞게 리스트 가져오기
 * loginKey,
 * query {
 *  pageNo    {페이지 Index}
 *  
 * }
 */
router.get('/api/memoList', (req, res) => {
    console.log(req.url, 'Api MemoList');
    // 쿠키값 파싱.
})
// [e] API

module.exports = router
