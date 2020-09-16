// 테스트용 라우터 작업 완료된 후 삭제 예정.
const express = require('express');
const multer = require('multer');
const utils = require('../utils/commandUtil');
const path = require('path');
const fs = require('fs');
const dataModel = require('../models/uploadModelTest');

const storage = multer.diskStorage({
    // 서버에 저장할 폴더 생성.
    destination: function (req, file, callback) {
        console.log('File 타입' + file.mimetype)
        if (file.mimetype.startsWith('image')) {
            callback(null, './resource/test');
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
router.post('/api/uploadsTest', upload.array('file'), (req, res) => {
    let fileArr = req.files;
    // 이미지 파일 업로드 성공시 리턴
    console.log('Image File Upload Success');
    console.log(req.headers);
    console.log(fileArr);
    fileArr.length

    dataModel.addBlob(fileArr, function onMessage(err, rows) {
        if (err) {
            console.log('Sql Err\t' + err);
            res.status(416).end();
        } else {
            console.log('Sql Success');
            console.log(rows);
            res.status(200).end();

            // 파일 삭제 로직 추가.
            fileArr.forEach(function(file){
                console.log('File Path\t' + file.path);
                fs.unlinkSync(file.path);
            })
        }
    })

    // res.status(200).send({
    //     status: true,
    //     msg : '공사중입니다.!'
    // }).end();
})

router.get('/api/uploadsTest', (req, res) => {
    try {
        console.log("API Blob TEST Get" + req.query);
        dataModel.fetchBlobArr(req.query,function onMessage(err,rows) {
            if(err){
                console.log("Sql Error\t" + err);
                res.status(500).send({
                    status: false,
                    errMsg: err
                }).end();
            } else {
                console.log("Fetch BlobData");
                console.log(rows[0].BLOB_DATA_2);
                // fs.writeFileSync('test.jpg',rows[0].BLOB_DATA_1);

                res.status(200).send({
                    status:true,
                    test: 'test text',
                    blobData: rows[0].BLOB_DATA_2
                }).end();
            }
        })
    } catch (err) {
        console.log('Error\t' + err);
        res.status(416).send({
            status: false,
            errMsg: err
        }).end();
    }
})
// [e] API Start

module.exports = router