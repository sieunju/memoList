module.exports = function(app)
{
    var express = require('express');
    var router = express.Router();

    router.get('/',function(req,res){
        console.log("Request Path " + req.path);
        res.render('login.html');
    });

    // 로그인 페이지
    router.get('/login',function(req,res){
        console.log("Request Path " + req.path);
        res.render('login.html');
    });

    // 로그인 페이지
    router.get('/memoList',function(req,res){
        console.log("Request Path " + req.path);
        res.render('memoList.html');
    });

    // 메모 추가 페이지
    router.get('/addMemo',function(req,res){
        console.log("Request Path " + req.path);
        res.render('addMemo.html');
    });



    return router;
};