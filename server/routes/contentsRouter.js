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

router.get('/api/mainTest', (req, res) => {
    console.log(req.url, "MainTest")
    res.status(200).send(dummyUtil.dummyMainTestJson())
})

router.get('/api/main', (req, res) => {
    console.log(req.url, "Main")
    var dummyImgpath1 = "https://media.vlpt.us/images/jojo_devstory/post/d55c083b-0876-4937-b594-2431992f874b/Jetpack_logo%20(2).png"
    var dummyImgpath2 = "https://t1.daumcdn.net/thumb/R720x0/?fname=http://t1.daumcdn.net/brunch/service/user/2B1N/image/sBdQ7stT2xeT4FNsSZ0-XzglOiM.jpg"
    var dummyImgpath3 = "https://blog.kakaocdn.net/dn/Qyx8Y/btqDeUCcCzB/2DFAnzHdFCbbiVhrkCk9lk/img.png"
    var dummyImgpath4 = "https://cdn.mos.cms.futurecdn.net/5NyzBxijspGUiFyCiz9F4-1200-80.jpg"
    var dummyImgpath5 = "https://files.itworld.co.kr/archive/image/2016/10/apple-sept12-invite-100734328-large_3x2.jpg"

    var dataList = new Array()
    // 탑배너
    dataList.push({
        type: "topBanner",
        dataList : [
            {
                v_image_path: dummyImgpath1
            },
            {
                v_image_path: dummyImgpath2
            },
            {
                v_image_path: dummyImgpath3
            },
            {
                v_image_path: dummyImgpath4
            },
        ]
    })
    // 진한 생활 상품
    dataList.push({
        type : "prd",
        dataList : [
            {
                v_title : "면역력",
                v_code : "ff",
                prd_list : [
                    {
                        v_title: "청량 파워업 (30포)",
                        v_img_path : dummyImgpath1,
                        v_price : 16500
                    },
                    {
                        v_title: "1899시그니처 오일",
                        v_img_path : dummyImgpath2,
                        v_price : 18000
                    },
                    {
                        v_title: "내공 냠냠",
                        v_img_path : dummyImgpath3,
                        v_price : 199999
                    },
                ]
            },
            {
                v_title : "성인병",
                v_code : "ff",
                prd_list : [
                    {
                        v_title: "성인병 청량 파워업 (30포)",
                        v_img_path : dummyImgpath1,
                        v_price : 16500
                    },
                    {
                        v_title: "성인병 1899시그니처 오일",
                        v_img_path : dummyImgpath2,
                        v_price : 18000
                    },
                    {
                        v_title: "성인병 내공 냠냠",
                        v_img_path : dummyImgpath3,
                        v_price : 199999
                    },
                ]
            }
        ]
    })
    // 진한 생활 이벤트
    dataList.push({
        type : "event",
        eventList : [
            {
                v_title : "이벤트1",
                v_url: "www.google.com",
                v_img_path : dummyImgpath4
            },
            {
                v_title : "이벤트2",
                v_url: "www.google.com",
                v_img_path : dummyImgpath5
            },
            {
                v_title : "이벤트3",
                v_url: "www.google.com",
                v_img_path : dummyImgpath4
            }
        ]
    })
    // 진한 생활 샘플링
    dataList.push({
        type : "sampling",
        dataList : [
            {
                v_title : "이벤트1",
                v_url: "www.google.com",
                v_img_path : dummyImgpath4
            },
            {
                v_title : "이벤트2",
                v_url: "www.google.com",
                v_img_path : dummyImgpath5
            },
            {
                v_title : "이벤트1",
                v_url: "www.google.com",
                v_img_path : dummyImgpath4
            }
        ]
    })

    // 생활 정보.
    dataList.push({
        type : "tip",
        dataList : [
            {
                v_title : "면역력",
                v_code : "ff",
                prd_list : [
                    {
                        v_title: "청량 파워업 (30포)",
                        v_img_path : dummyImgpath1,
                        v_price : 16500
                    },
                    {
                        v_title: "1899시그니처 오일",
                        v_img_path : dummyImgpath2,
                        v_price : 18000
                    },
                    {
                        v_title: "내공 냠냠",
                        v_img_path : dummyImgpath3,
                        v_price : 199999
                    },
                ]
            },
            {
                v_title : "성인병",
                v_code : "ff",
                prd_list : [
                    {
                        v_title: "성인병 청량 파워업 (30포)",
                        v_img_path : dummyImgpath1,
                        v_price : 16500
                    },
                    {
                        v_title: "성인병 1899시그니처 오일",
                        v_img_path : dummyImgpath2,
                        v_price : 18000
                    },
                    {
                        v_title: "성인병 내공 냠냠",
                        v_img_path : dummyImgpath3,
                        v_price : 199999
                    },
                ]
            }
        ]
    })

    // 동영상
    dataList.push({
        type: "movie",
        v_img_path : "https://img.youtube.com/vi/A5AmE_b68cg/hqdefault.jpg"
    })

    // 포인트?
    dataList.push({
        type : "point",
        berr_point : 25000,
        jin_point : 24999
    })

    // 타입을 찾아보자
    dataList.push({
        type : "skinFind"
    })

    // 공지 사항
    dataList.push({
        type : "notice",
        contents : "공지사하아아아아아아아ㅏ아알ㄹㄹ"
    })

    res.status(200).send({
        data: {
            list: dataList,
            success : true
        }
    })
})

router.get('/api/jsonTest', (req, res) => {
    let testNo = req.query.testNo
    if (testNo != null) {
        res.status(200).send({
            status: true,
            msg: "Hellow Test",
            testMsg: "Hi Test",
            nullMsg: null
        }).end()
    } else {
        res.status(404).send({
            status: false,
            testMsg: null
        }).end()
    }
})
// [E] TEST

module.exports = router
