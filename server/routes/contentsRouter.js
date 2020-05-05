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
    res.render('memoList.html');
    res.end();
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
    try {
        console.log(req.url, 'AddMemo');
        // 쿠키값 파싱.
        const loginKey = utils.getLoginKey(req);
        console.log("============================");
        console.log(req.url, 'LoginKey ' + loginKey);
        console.log(req.url, req.body);
        console.log("============================");
        dataModel.addMemo(loginKey, req.body);

        // 앱인경우.
        if (utils.isApp(req)) {
            res.status(200).send({
                msg: 'success'
            })
        }
        // 웹인경우.
        else {
            res.redirect('/memoList');
        }
    } catch (err) {
        console.log("Error /api/addMemo ", err);
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
router.get('/api/memoList', (req, res) => {
    try {
        // 로그인 키값 get
        const loginKey = utils.getLoginKey(req);
        let currentPage = Number(req.query.pageNo);

        console.log(req.url, "Login Key " + loginKey);

        dataModel.getMemo(loginKey, req.query, function onMessage(err, rows) {
            if (err) {
                console.log(req.url, " Error " + err);

                res.status(416).send({
                    error: err
                })
            }
            // Query 정상 동작 한경우.
            else {
                console.log(req.url, " Query Success");
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

                // console.log(rows);

                res.status(200).send({
                    dataList: rows,
                    pageNo: currentPage,
                    hasMore: hasMore
                });

            }
        })
    } catch (err) {
        console.log("Error /api/memoList ", err);
        res.status(416).send({ error: '유효하지 않는 값입니다.' });
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
router.put('/api/updateMemo', (req, res) => {
    try {
        console.log(req.url, "Memo Update ");
        const loginKey = utils.getLoginKey(req);
        console.log('LoginKey ' + loginKey);
        dataModel.updateMemo(loginKey, req.body, function onMessage(err) {
            if (err) {
                // 앱인경우
                if (utils.isApp(req)) {
                    res.status(416).send({
                        error: err
                    })
                }
                // 웹인경우.
                else {
                    res.end();
                }
            } else {
                console.log(req.url, "Sucess");
                res.status(200).send({
                    msg: 'success'
                })
            }
        });
    } catch (err) {
        console.log("Error /api/updateMemo ", err);
        res.status(416).send({ error: '유효하지 않는 값입니다.' });
    }
});

router.get('api/searchKeyword', (req, res) => {
    console.log(req.url, "Memo KeyWord ");
    const loginKey = utils.getLoginKey(req);

})
// [e] API

module.exports = router
