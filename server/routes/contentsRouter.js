/**
 * 메모에 대한 API 클래스
 * Created by hmju
 */
const express = require('express');
const contents = require('../models/contentModel');

const router = express.Router();

// 메모 추가.
router.post('/api/addMemo',(req,res) => {
    console.log("AddMemo " + req.path);
    res.render('memoList.html');
});

// 메모 리스트 페이지 접근
router.get('/memoList',(req,res) =>{
    console.log("memoList Page Enter " + req.path);
    res.render('memoList.html');
});

module.exports = router
