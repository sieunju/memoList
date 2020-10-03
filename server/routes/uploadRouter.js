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

            dataModel.addFiles(req.files, req.body, function onMessage(err, rows) {
                if (err) {
                    console.log('Sql Error ' + err)
                    res.status(416).send({
                        status: false,
                        errMsg: err
                    }).end()
                } else {
                    console.log('Sql Success')
                    try {
                        let filePathList = new Array()
                        // 추가된 파일을 다시 검색해서 가져온다.
                        rows.forEach(e => {
                            filePathList.push({
                                manageNo: e.UID,
                                path: e.RESOURCE_PATH
                            })
                        })

                        res.status(200).send({
                            status: true,
                            pathList: filePathList
                        }).end()
                    } catch (err) {
                        res.status(400).send({
                            status: true,
                            msg: 'SqlSuccess And File Parsing Error'
                        }).end()
                    }
                }
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

        console.log("=========FILE DELETE===========================")
        console.log(manageNoList)
        console.log(pathList)
        console.log("=========FILE DELETE===========================")

        // Query 유효성 검사.
        
        if (manageNoList.length != pathList.length) {
            res.status(400).send({
                status: false,
                errMsg: '파라미터값이 유효하지 않습니다.'
            })
            return
        }
        dataModel.deleteFile(manageNoList, pathList, function onMesage(err, rows) {
            console.log(err)
            if (err) {
                res.status(400).send({
                    status: false,
                    errMsg: err
                }).end()
            } else {
                res.status(200).send({
                    status: true,
                    msg: '파일이 정상적으로 삭제 되었습니다.'
                }).end()

                // 파일 삭제
                for (let i = 0; i < pathList.length; i++) {
                    try {
                        console.log("PATH " + pathList[i])
                        fs.unlinkSync('../' + pathList[i])
                    } catch (err) {
                        console.log("===========파일 삭제 에러")
                        console.log(err)
                        console.log("===========파일 삭제 에러")
                    }
                }
            }
        })
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