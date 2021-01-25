/**
 * 메모에 대한 라우터
 * Created by hmju
 */
const express = require('express');
const router = express.Router();
const dataModel = require('../models/contentModel');
const utils = require('../utils/commandUtil');

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
 *  contents        {내용}
 * }
 */
router.post('/api/memo', (req, res) => {
    try {
        // 쿠키값 파싱.
        console.log(req.body)
        const cmmInfo = utils.reqInfo(req);
        console.log('AddMemo LoginKey: ' + cmmInfo.loginKey)
        dataModel.addMemo(cmmInfo.loginKey, req.body, function onMessage(err, rows) {
            if (err) {
                console.log('Sql Error ' + err)
                res.status(416).send({
                    status: false,
                    errMsg: err
                }).end()
            } else {
                // 앱인경우.
                if (utils.isApp(cmmInfo)) {
                    // insertId -> Memo Id이므로 전달.
                    res.status(200).send({
                        status: true,
                        manageNo: rows.insertId 
                    }).end();
                }
                // 웹인경우.
                else {
                    res.redirect('/memoList');
                }
            }
        });
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

        dataModel.fetchMemo(loginKey, req.query, function onMessage(err, rows) {
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

                try {
                    const map = new Map()
                    rows.forEach(e => {
                        const key = e.MEMO_ID
                        if (map.has(e.MEMO_ID)) {
                            map.get(e.MEMO_ID).fileList.push({
                                manageNo: e.UID,
                                path: e.RESOURCE_PATH
                            })
                        } else {
                            let item = {
                                manageNo: e.MEMO_ID,
                                tag: e.TAG,
                                title: e.TITLE,
                                contents: e.CONTENTS,
                                fileList: (e.RESOURCE_PATH == null) ? [] : [
                                    {
                                        manageNo: e.UID,
                                        path: e.RESOURCE_PATH
                                    }
                                ],
                                regDtm: e.REGISTER_DATE
                            }

                            map.set(e.MEMO_ID, item)
                        }
                    })

                    // let values = Array.from(map.values())

                    let hasMore = true
                    if (map.size < 20) {
                        hasMore = false
                    }

                    res.status(200).send({
                        status: true,
                        dataList: Array.from(map.values()),
                        pageNo: currentPage,
                        hasMore: hasMore
                    }).end()

                } catch (err) {
                    res.status(416).send({
                        status: false,
                        errMsg: 'Error ' + err
                    }).end();
                }
            }
        })
    } catch (err) {

        utils.logE('FetchMemo Error LoginKey: ' + loginKey + '\t' + err);
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

/**
 * 메모 삭제.
 * 메모 아이디만 가지고 삭제.
 */
router.delete('/api/memo', (req, res) => {
    try {
        const cmmInfo = utils.reqInfo(req)
        dataModel.deleteMemo(cmmInfo.loginKey, req.query, function onMessage(err, rows) {
            if (err) {
                // 앱인경우
                if (utils.isApp(cmmInfo)) {
                    res.status(400).send({
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
                res.status(200).send({
                    status: true,
                    msg: '메모가 정상적으로 삭제 되었습니다.'
                }).end();
            }
        })
    } catch (err) {
        res.status(400).send({
            status: false,
            errMsg: err
        }).end();
    }
})

router.get('/api/searchKeyword', (req, res) => {
    console.log(req.url, "Memo KeyWord ");
    const cmmInfo = utils.reqInfo(req);
})

// [e] API
// [S] TEST
const dummyUtil = require('../utils/dummyUtil');

router.get('/api/mainTest',(req,res) => {
    console.log(req.url,"MainTest")
    res.status(200).send(dummyUtil.dummyMainTestJson())   
})

router.get('/api/jsonTest',(req,res) => {
    let testNo = req.query.testNo
    if(testNo != null) {
        res.status(200).send({
            status : true,
            msg : "Hellow Test",
            testMsg : "Hi Test",
            nullMsg : null
        }).end()
    } else {
        res.status(404).send({
            status : false,
            testMsg : null
        }).end()
    }
})
// [E] TEST

module.exports = router
