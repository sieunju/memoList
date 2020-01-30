/**
 * 메모에 대한 API 클래스
 * Created by hmju
 */
const express = require('express');
const dataModel = require('../models/contentModel');

const router = express.Router();

// [s] Page
// 메모 리스트 페이지
router.get('/memoList',(req,res) =>{
    console.log("memoList Page Enter " + req.path);
    res.render('memoList.html');
});

// 메모 추가 페이지
router.get('/addMemo',(req,res) => {
    console.log("addMemo Page Enter " + req.path);
    res.render('addMemo.html');
})
// [e] Page

// [s] API
// 메모 추가.
router.post('/api/addMemo',(req,res) => {
    console.log("AddMemo " + req.path);
    res.render('memoList.html');
});


// [e] API

module.exports = router
