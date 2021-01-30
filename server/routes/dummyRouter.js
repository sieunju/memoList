const express = require('express');
const router = express.Router();
const dataModel = require('../models/contentModel');
const utils = require('../utils/commandUtil');

// [S] TEST

const dummyImgpath1 = "https://media.vlpt.us/images/jojo_devstory/post/d55c083b-0876-4937-b594-2431992f874b/Jetpack_logo%20(2).png"
const dummyImgpath2 = "https://t1.daumcdn.net/thumb/R720x0/?fname=http://t1.daumcdn.net/brunch/service/user/2B1N/image/sBdQ7stT2xeT4FNsSZ0-XzglOiM.jpg"
const dummyImgpath3 = "https://blog.kakaocdn.net/dn/Qyx8Y/btqDeUCcCzB/2DFAnzHdFCbbiVhrkCk9lk/img.png"
const dummyImgpath4 = "https://cdn.mos.cms.futurecdn.net/5NyzBxijspGUiFyCiz9F4-1200-80.jpg"
const dummyImgpath5 = "https://files.itworld.co.kr/archive/image/2016/10/apple-sept12-invite-100734328-large_3x2.jpg"
const dummyImgpath6 = "https://cdnweb01.wikitree.co.kr/webdata/editor/202005/09/img_20200509102113_fb2159a8.webp"
const dummyImgpath7 = "https://bnetcmsus-a.akamaihd.net/cms/blog_header/t6/T6WOKKGZS7NV1540607288927.jpg"
const dummyImgArr = new Array(dummyImgpath1, dummyImgpath2, dummyImgpath3, dummyImgpath4, dummyImgpath5, dummyImgpath6, dummyImgpath7)

const dummyProduct1 = {
    v_prd_nm: "랜덤 상품 1",
    v_prd_cd: "PRD0001",
    v_img_path: dummyImgpath1,
    v_opt_nm: "420mg X 180정 + 200mg x 60 정",
    v_opt_cd: "OPT0001",
    v_price: 35200
}

const dummyProduct2 = {
    v_prd_nm: "랜덤 상품 2",
    v_prd_cd: "PRD0002",
    v_img_path: dummyImgpath2,
    v_opt_nm: "420mg X 180정 + 200mg x 60 정",
    v_opt_cd: "OPT0002",
    v_price: 344400
}

const dummyProduct3 = {
    v_prd_nm: "랜덤 상품 3",
    v_prd_cd: "PRD0003",
    v_img_path: dummyImgpath3,
    v_opt_nm: "420mg X1 180정 + 200mg x 60 정",
    v_opt_cd: "OPT0003",
    v_price: 456200
}

const dummyProduct4 = {
    v_prd_nm: "랜덤 상품 4",
    v_prd_cd: "PRD0004",
    v_img_path: dummyImgpath4,
    v_opt_nm: "420mg X 180정 + 200mg x 60 정",
    v_opt_cd: "OPT0004",
    v_price: 125200
}

const dummyProduct5 = {
    v_prd_nm: "랜덤 상품 5",
    v_prd_cd: "PRD0005",
    v_img_path: dummyImgpath5,
    v_opt_nm: "420mg X 180정 + 200mg x 60 정",
    v_opt_cd: "OPT0005",
    v_price: 3135200
}

const dummyProduct6 = {
    v_prd_nm: "시그니처 화장품 얍얍!!!니나노",
    v_prd_cd: "PRD0006",
    v_img_path: dummyImgpath6,
    v_opt_nm: "420mg X 180정 + 200mg x 60 정",
    v_opt_cd: "OPT0006",
    v_price: 35200666
}

const dummyProduct7 = {
    v_prd_nm: "랜덤 입니다댜댭ㅃ 청량 파워업 (30포)",
    v_prd_cd: "PRD0007",
    v_img_path: dummyImgpath7,
    v_opt_nm: "420mg X 180정 + 200mg x 60 정",
    v_opt_cd: "OPT0007",
    v_price: 352011222
}

const dummyPrdArr = new Array(dummyProduct1, dummyProduct2, dummyProduct3, dummyProduct4, dummyProduct5, dummyProduct6, dummyProduct7)

const dummyUtil = require('../utils/dummyUtil');

router.get('/api/mainTest', (req, res) => {
    console.log(req.url, "MainTest")
    res.status(200).send(dummyUtil.dummyMainTestJson())
})

router.get('/api/main', (req, res) => {
    console.log(req.url, "Main")


    var dataList = new Array()
    // 탑배너
    dataList.push({
        type: "topBanner",
        dataList: [
            {
                v_txt_color: "#FFFFFF",
                v_image_path: dummyImgpath2
            },
            {
                v_txt_color: "#FFFFFF",
                v_image_path: dummyImgpath6
            },
            {
                v_txt_color: "#000000",
                v_image_path: dummyImgpath5
            },
            {
                v_txt_color: "#FFFFFF",
                v_image_path: dummyImgpath7
            },
        ]
    })
    // 진한 생활 상품
    dataList.push({
        type: "prd",
        dataList: [
            {
                v_title: "면역력",
                v_code: "ff",
                prd_list: [
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)]
                ]
            },
            {
                v_title: "성인병",
                v_code: "ff",
                prd_list: [
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)]
                ]
            },
            {
                v_title: "하품",
                v_code: "ff",
                prd_list: [
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)]
                ]
            },
            {
                v_title: "ㅁㄴㅇㄹ",
                v_code: "ff",
                prd_list: [
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)]
                ]
            },
            {
                v_title: "ㅂㅂㅂㅂㅂ",
                v_code: "ff",
                prd_list: [
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)]
                ]
            },
            {
                v_title: "성인ㄱㄱㄱㄱ병",
                v_code: "ff",
                prd_list: [
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)]
                ]
            }
        ]
    })
    // 진한 생활 이벤트
    dataList.push({
        type: "event",
        eventList: [
            {
                v_event_title: "이벤트1",
                v_url: "www.google.com",
                v_img_path: dummyImgpath4
            },
            {
                v_event_title: "이벤트2",
                v_url: "www.google.com",
                v_img_path: dummyImgpath7
            },
            {
                v_event_title: "이벤트3",
                v_url: "www.google.com",
                v_img_path: dummyImgpath6
            },
            {
                v_event_title: "이벤트4",
                v_url: "www.google.com",
                v_img_path: dummyImgpath2
            },
            {
                v_event_title: "이벤트5",
                v_url: "www.google.com",
                v_img_path: dummyImgpath1
            },
            {
                v_event_title: "이벤트6",
                v_url: "www.google.com",
                v_img_path: dummyImgpath3
            }
        ]
    })
    // 진한 생활 샘플링
    dataList.push({
        type: "sampling",
        dataList: [
            {
                v_event_title: "이벤트1",
                v_url: "www.google.com",
                v_img_path: dummyImgpath2
            },
            {
                v_event_title: "이벤트2",
                v_url: "www.google.com",
                v_img_path: dummyImgpath3
            },
            {
                v_event_title: "이벤트1",
                v_url: "www.google.com",
                v_img_path: dummyImgpath7
            }
        ]
    })

    // 생활 정보.
    dataList.push({
        type: "tip",
        dataList: [
            {
                v_title: "면역력",
                v_code: "ff",
                prd_list: [
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)]
                ]
            },
            {
                v_title: "성인병",
                v_code: "ff",
                prd_list: [
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)],
                    dummyPrdArr[getRanRange(dummyPrdArr.length - 1)]
                ]
            }
        ]
    })

    // 동영상
    dataList.push({
        type: "movie",
        v_img_path: "https://img.youtube.com/vi/A5AmE_b68cg/hqdefault.jpg"
    })

    // 포인트?
    dataList.push({
        type: "point",
        berr_point: 25000,
        jin_point: 24999
    })

    // 타입을 찾아보자
    dataList.push({
        type: "skinFind"
    })

    // 공지 사항
    dataList.push({
        type: "notice",
        contents: "공지사하아아아아아아아ㅏ아알ㄹㄹ"
    })

    res.status(200).send({
        data: {
            list: dataList,
            success: true
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

router.get('/api/event/list', (req, res) => {
    console.log("PageNo " + req.query.pageNo + "Code " + req.query.code)
    let pageNo = req.query.pageNo
    let code = req.query.code
    var maxPageSize = 4
    if (code == 'ING') {
        maxPageSize = 8
    }
    let dataList = new Array()
    let startIndex = (pageNo - 1) * 20
    if (pageNo == maxPageSize) {
        res.status(200).send({
            data: {
                list: dataList,
                success: false
            }
        }).end()
    } else {
        let startDtm = getDtm(0)
        let endDtm = getDtm(getRanRange(10))
        for (let i = 0; i < 20; i++) {
            dataList.push({
                manage_no: "EVT" + (startIndex + i),
                v_event_title: "이벤트 타이틀",
                v_url: "https://www.naver.com",
                v_img_path: dummyImgArr[getRanRange(dummyImgArr.length - 1)],
                v_event_contents: "이벤트 내용~~~~",
                v_st_dtm: startDtm,
                v_et_dtm: endDtm
            })
        }

        setTimeout(function () {
            res.status(200).send({
                data: {
                    list: dataList,
                    success: true
                }
            }).end()
        }, 2000)

    }
})

const dummyTagArr = new Array("BEST", "이벤트", "대표", "NEW")
const dummyHashTagArr = new Array("면역력", "안티에이징", "건강식품", "보습")

router.get('/api/product/list', (req, res) => {
    try {
        console.log(req.path + " PageNo " + req.query.pageNo)
        let pageNo = req.query.pageNo
        let dataList = new Array()
        let startIndex = (pageNo - 1) * 20
        if (pageNo == 5) {
            for (let i = 0; i < 16; i++) {
                dataList.push({
                    v_prd_cd: "PRO" + (startIndex + i),
                    v_prd_nm: "자생 퍼펙트 쿠션 SPF50⁺, PA⁺⁺⁺",
                    v_img_path: dummyImgArr[getRanRange(dummyImgArr.length - 1)],
                    tags: getRanTags(getRanRange(2)),
                    hashTags: getRanHashTags(getRanRange(4)),
                    v_price: getRanRange(1000000)
                })
            }
        } else {
            for (let i = 0; i < 20; i++) {
                dataList.push({
                    v_prd_cd: "PRO" + (startIndex + i),
                    v_prd_nm: "자생 퍼펙트 쿠션 SPF50⁺, PA⁺⁺⁺",
                    v_img_path: dummyImgArr[getRanRange(dummyImgArr.length - 1)],
                    tags: getRanTags(getRanRange(2)),
                    hashTags: getRanHashTags(getRanRange(4)),
                    v_price: getRanRange(1000000)
                })
            }
        }

        res.status(200).send({
            data: {
                list: dataList,
                success: true
            }
        }).end()
    } catch (err) {
        console.log(err)
    }
})

router.get('/api/notification/list', (req, res) => {
    try {
        console.log(req.path + " PageNo " + req.query.pageNo)
        let pageNo = req.query.pageNo
        let dataList = new Array()
        let startIndex = (pageNo - 1) * 20
        if (pageNo == 5) {
            for (let i = 0; i < 3; i++) {
                dataList.push({
                    v_seq_no: "PRO" + (startIndex + i),
                    v_title: "자생 퍼펙트 쿠션 SPF50⁺, PA⁺⁺⁺",
                    v_contents: "콘텐츠~"
                })
            }
        } else {
            for (let i = 0; i < 10; i++) {
                dataList.push({
                    v_seq_no: "PRO" + (startIndex + i),
                    v_title: "자생 퍼펙트 쿠션 SPF50⁺, ㄷ",
                    v_contents: "콘텐츠~"
                })
            }
        }

        res.status(200).send({
            data: {
                list: dataList,
                success: true
            }
        }).end()
    } catch (err) {
        console.log(err)
    }
})

router.get('/api/header/test', (req, res) => {
    try {
        let headers = req.headers
        console.log(headers)
        res.status(200).send({
            headers
        }).end()
    } catch (err) {
        console.log("Error!!!! " + err)
    }
})

function getRanRange(range) {
    return getRanRange(range, true)
}

function getRanRange(range, isZero) {
    if (isZero) {
        return Math.floor(Math.random() * range)
    } else {
        return Math.floor(Math.random() * range + 1)
    }
}

function getRanTags(range) {
    const tags = new Set()
    for (let i = 0; i < range; i++) {
        tags.add(dummyTagArr[getRanRange(dummyTagArr.length - 1)])
    }
    return Array.from(tags)
}

function getRanHashTags(range) {
    const hashTags = new Set()
    for (let i = 0; i < range; i++) {
        hashTags.add(dummyHashTagArr[getRanRange(dummyHashTagArr.length - 1)])
    }
    return Array.from(hashTags)
}

function getDtm(nextDay) {
    var now = new Date();
    if (nextDay > 0) {
        var after = new Date(now.setDate(now.getDate() + nextDay))
        var year = after.getFullYear();
        var month = ("0" + (1 + after.getMonth())).slice(-2);
        var day = ("0" + after.getDate()).slice(-2);
        return year + ". " + month + ". " + day;
    } else {
        var year = now.getFullYear();
        var month = ("0" + (1 + now.getMonth())).slice(-2);
        var day = ("0" + now.getDate()).slice(-2);
        return year + ". " + month + ". " + day;
    }
}
// [E] TEST

module.exports = router