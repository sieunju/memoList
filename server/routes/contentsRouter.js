/**
 * 메모에 대한 라우터
 * Created by hmju
 */
const express = require('express');
const router = express.Router();
const dataModel = require('../models/contentModel');
const utils = require('../utils/commandUtil');
const fs = require('fs');
const multer = require('multer');
const upload = multer();

// [s] Page

/**
 * 사용자에 맞게 리스트 가져오기.
 * loginKey,
 * query {
 *  pageNo {페이지 Index}
 * }
 */
router.get('/memoList', (req, res) => {
    utils.logD("Enter" + req.url);
    res.render('memoList.html');
    res.end();
});



// 메모 추가 페이지
router.get('/addMemo', (req, res) => {
    utils.logD("Enter" + req.url);
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
router.post('/api/memo', (req, res) => {
    try {
        // 쿠키값 파싱.
        const cmmInfo = utils.reqInfo(req);
        console.log('AddMemo LoginKey: ' + cmmInfo.loginKey + '\tBody: ' + req.body);
        dataModel.addMemo(cmmInfo.loginKey, req.body);

        // 앱인경우.
        if (utils.isApp(cmmInfo)) {
            res.status(200).send({
                status: true
            }).end();
        }
        // 웹인경우.
        else {
            res.redirect('/memoList');
        }
    } catch (err) {
        console.log('AddMemo Error ' + err);
        res.status(416).send({
            status: false,
            errMsg: err
        }).end();

    }
});

/**
 * 사용자에 맞게 리스트 가져오기
 * loginKey,
 * query {
 *  pageNo      {페이지 Index}
 *  sortOpt     {정렬 옵션}
 *  filterOpt   {필터 옵션}
 * }
 */
router.get('/api/memo', (req, res) => {
    try {
        // 로그인 키값 get
        const loginKey = utils.reqInfo(req).loginKey;
        let currentPage;

        // PageNo Null 인경우 기본값  1로 세팅.
        if (req.query.pageNo == null) {
            req.query.pageNo = 1;
            currentPage = 1;
        } else {
            currentPage = Number(req.query.pageNo);
        }

        dataModel.getMemo(loginKey, req.query, function onMessage(err, rows) {
            if (err) {
                utils.logE('GetMemo Sql Error LoginKey: ' + loginKey + '\t' + err)

                res.status(416).send({
                    status: false,
                    errMsg: err
                }).end()
            }
            // Query 정상 동작 한경우.
            else {

                utils.logD('GetMemo Success LoginKey: ' + loginKey + '\t Path' + req.url)
                // 옵션 세팅
                // let options = {
                //     "pageNo" : ++pageNo,
                //     "sortOpt" : sortOpt,
                // }

                // 데이터 더이상 부를것인지 체크.
                let hasMore = true;
                // if(rows[19] == null){
                //     hasMore = false;
                // }

                if (rows[9] == null) {
                    hasMore = false;
                }

                res.status(200).send({
                    status: true,
                    dataList: rows,
                    pageNo: currentPage,
                    hasMore: hasMore
                }).end();

            }
        })
    } catch (err) {

        utils.logE('GetMemo Error LoginKey: ' + loginKey + '\t' + err);
        res.status(416).send({
            status: false,
            errMsg: 'Error ' + err
        }).end();
    }
});

/**
 * 메모 데이터 수정
 * loginKey,
 * body {
 *  memoId,
 *  tag,
 *  title,
 *  contents
 * }
 */
router.put('/api/memo', (req, res) => {
    try {
        const cmmInfo = utils.reqInfo(req)

        dataModel.updateMemo(cmmInfo.loginKey, req.body, function onMessage(err) {
            if (err) {
                utils.logE('Update Memo SQL Fail LoginKey: ' + cmmInfo.loginKey + '\t ' + err)
                // 앱인경우
                if (utils.isApp(cmmInfo)) {
                    res.status(416).send({
                        status: false,
                        errMsg: err
                    }).end()
                }
                // 웹인경우.
                else {
                    res.status(404).send({
                        status: false,
                        errMsg: err
                    }).end()
                }
            } else {
                utils.logD('UpDate Memo Success LoginKey: ' + cmmInfo.loginKey)
                res.status(200).send({
                    status: true
                }).end();
            }
        });
    } catch (err) {
        utils.logE('Update Memo Fail LoginKey: ' + cmmInfo.loginKey + '\t ' + err)
        res.status(416).send({
            status: false,
            errMsg: err
        }).end();
    }
});

router.get('/api/searchKeyword', (req, res) => {
    console.log(req.url, "Memo KeyWord ");
    const cmmInfo = utils.reqInfo(req);
})

// [s] TEST 코드
router.get('/api/test', (req, res) => {
    try {
        // 로그인 키값 get
        const loginKey = 'U2FsdGVkX1+gh+kWnPG3nmTF2kPKuEC3XYT3b87YsvQ=';
        let currentPage;

        // PageNo Null 인경우 기본값  1로 세팅.
        if (req.query.pageNo == null) {
            req.query.pageNo = 1;
            console.log('')
            currentPage = 1;
        } else {
            currentPage = Number(req.query.pageNo);
        }

        const cmmInfo = utils.reqInfo(req);

        if (cmmInfo.osType == null) {
            res.status(400).send({
                status: false,
                errMsg: 'OS Type이 없습니다. Os Type에 아무 값을 입력해주세요.'
            }).end();
            return;
        }

        dataModel.getMemo(loginKey, req.query, function onMessage(err, rows) {
            if (err) {
                console.log('GetMemo Sql Error LoginKey: ' + loginKey + '\t' + err)

                res.status(416).send({
                    status: false,
                    errMsg: err
                }).end()
            }
            // Query 정상 동작 한경우.
            else {

                console.log('GetMemo Success LoginKey: ' + loginKey + '\t Path' + req.url)
                // 옵션 세팅
                // let options = {
                //     "pageNo" : ++pageNo,
                //     "sortOpt" : sortOpt,
                // }

                // 데이터 더이상 부를것인지 체크.
                let hasMore = true;
                // if(rows[19] == null){
                //     hasMore = false;
                // }

                if (rows[19] == null) {
                    hasMore = false;
                }

                res.status(200).send({
                    status: true,
                    dataList: rows,
                    pageNo: currentPage,
                    hasMore: hasMore
                }).end();

            }
        })
    } catch (err) {

        utils.logE('GetMemo Error LoginKey: ' + loginKey + '\t' + err);
        res.status(416).send({
            status: false,
            errMsg: 'Error ' + err
        }).end();
    }
})

router.post('/api/test', (req, res) => {
    try {
        const body = req.body;
        if (body.user_id == null) {
            res.status(400).send({
                status: false,
                errMsg: 'user_id 값이 없습니다.'
            }).end();
        } else if (body.user_pw == null) {
            res.status(400).send({
                status: false,
                errMsg: 'user_pw 값이 없습니다.'
            }).end();
        } else {
            res.status(200).send({
                status: true,
                msg: 'Success YapYap!'
            }).end();
        }
    } catch (err) {

        res.status(416).send({
            status: false,
            errMsg: err
        }).end();
    }
})

router.post('/api/blob', upload.any() ,(req, res) => {
    try {
        console.log("Blob 여기 들어옴.");
        dataModel.blobTest(req.files[0], function onMessage(err, rows) {
            if (err) {
                res.status(400).send({
                    status: false,
                    errMsg: err
                }).end();
            } else {
                res.status(200).send({
                    status: true,
                    response: rows
                }).end();
            }
        })
    } catch (err) {
        res.status(416).send({
            status: false,
            errMsg: err
        }).end();
    }
})

router.post('/api/blobTT',(req,res) => {
    try{
        console.log("Blob 여기 들어옴 TT");
        req.setEncoding('utf8');
        console.log(req);
        res.status(400).send({
            status: false
        }).end();
    }catch(err){
        console.log('Error\t' + err);
        res.status(416).send({
            status: false,
            errMsg: err
        }).end();
    }
})
// [e] TEST 코드

// [e] API

module.exports = router
