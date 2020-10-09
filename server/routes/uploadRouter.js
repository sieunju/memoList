/**
 * 파일 업로드 관련 라우터
 * Visual Studio 줄 정렬 -> Shift + Option + F
 * Created by hmju
 */
const express = require('express');
const multer = require('multer');
const utils = require('../utils/commandUtil');
const path = require('path');
const fs = require('fs');
const dataModel = require('../models/uploadModel');

const storage = multer.diskStorage({
    // 서버에 저장할 폴더 생성.
    destination: function (req, file, callback) {
        console.log('File 타입' + file.mimetype)
        if (file.mimetype.startsWith('image')) {
            callback(null, process.env.UPLOAD_IMG);
        } else {
            // 기타 파일..움..이거는 추후 개발 예정. 하지만 안할수도 있음. 굳이 할필요가 없어 보임.
            console.log('잘못된 파일 타입입니다.!');
        }
    },
    // 서버에 저장할 파일명
    filename: function (req, file, callback) {
        let extension = path.extname(file.originalname);
        const ranDomName = Math.random().toString(36).substr(2, 11);
        callback(null, 'IMG_' + Date.now() + ranDomName + extension);
    }
});

const filter = (req, file, callback) => {

    if (file.mimetype.startsWith('image')) {
        callback(null, true);
    } else {
        console.log("이미지 파일이 아닙니다.!");
        callback('Plz upload Only Images.', false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: filter
})

const router = express.Router();

// [s] API Start
router.get('/upload', (req, res) => {
    res.render('dummyUpload.html');
})

/**
 * 파일 업로드
 * @param {MultiPart} file
 */
router.post('/api/uploads', upload.array('files'), (req, res) => {
    try {
        // 필수값 유효성 검사.
        if (utils.isValidString(req.body.memoId)) {
            const memoId = req.body.memoId

            let filePathList = new Array()
            const fileSize = req.files.length
            let callBackCnt = 0

            req.files.forEach(e => {
                dataModel.addFile(memoId, e.path, function onMessage(err, rows) {
                    callBackCnt++
                    // Sql Error
                    if (err) {
                    } else {
                        // Sql Success
                        filePathList.push({
                            manageNo: rows.insertId,
                            path: e.path
                        })
                    }

                    // 모든 CallBack 완료 했다면.
                    if (callBackCnt == fileSize) {
                        console.log('=================Query Success==============')
                        console.log(filePathList)

                        res.status(200).send({
                            status: true,
                            pathList: filePathList
                        }).end()
                    }

                })
            })
        } else {
            res.status(416).send({
                status: false,
                errMsg: '필수 키값이 없습니다..'
            }).end()
        }
    } catch (err) {
        console.log('Add File Error ' + err)
        res.status(416).send({
            status: false,
            errMsg: err
        }).end()
    }
})

/**
 * 해당 파일 삭제.
 */
router.delete('/api/uploads', (req, res) => {
    try {
        let manageNoList
        let pathList
        if (Array.isArray(req.query.manageNoList)) {
            manageNoList = req.query.manageNoList
        } else {
            manageNoList = new Array(req.query.manageNoList)
        }

        if (Array.isArray(req.query.pathList)) {
            pathList = req.query.pathList
        } else {
            pathList = new Array(req.query.pathList)
        }

        // Query 유효성 검사.
        if (manageNoList.length != pathList.length) {
            res.status(400).send({
                status: false,
                errMsg: '파라미터값이 유효하지 않습니다.'
            })
            return
        }

        // DB Query 실행 기준은 File Id 리스트 기준.
        const callBackLength = manageNoList.length
        let callBackCnt = 0
        for (let i = 0; i < callBackLength; i++) {
            dataModel.deleteFile(manageNoList[i], pathList[i], function onMessage(err, rows) {
                callBackCnt++
                // Sql Error 
                if (err) {
                    console.log('Sql Error')
                    console.log(err)
                } else {
                    // Sql Success
                    console.log('Sql Success')
                    console.log(rows)
                }

                try {
                    const deletePath = '' + pathList[i]
                    console.log('Delete Path ' + deletePath)
                    fs.unlinkSync(deletePath)
                } catch (err) {
                    console.log('File Delete Error')
                    console.log(err)
                }

                // 모든 CallBack 완료 했다면.
                if (callBackCnt == callBackLength) {
                    console.log('Delete Query Successs')
                    res.status(200).send({
                        status: true,
                        msg: '파일이 정상적으로 삭제 되었습니다.'
                    }).end()
                }
            })
        }
    } catch (err) {
        console.log('Delete File Error ' + err)
        res.status(416).send({
            status: false,
            errMsg: err
        }).end()
    }
})
// [e] API Start

module.exports = router