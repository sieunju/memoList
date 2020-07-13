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
        const ranDomName = Math.random().toString(36).substr(2,11);
        callback(null,'IMG_' +  Date.now() + ranDomName + extension);
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

router.get('/upload', (req, res) => {
    res.render('dummyUpload.html');
})

/**
 * 파일 업로드
 * @param {MultiPart} file
 */
router.post('/api/uploads', upload.single('file'), (req, res) => {

    let file = req.file;
    // 이미지 파일 업로드 성공시 리턴
    console.log('Image File Upload Success');
    console.log(file);
    res.status(200).send({
        status: true,
        mimeType: file.mimetype,
        imgPath: file.path
    }).end();
})

/**
 * 파일 삭제
 * @param imgPath 이미지 경로 및 파일 명.
 */
router.delete('/api/uploads',(req,res) => {
    console.log(req.body);
    // 제대로 된 이미지 경로인지 확인. TODO 추후 아이디 유무 조건문 추가해야함.
    if(req.body.imgPath.startsWith('resource/img/')){
        fs.unlink(req.body.imgPath,(err) =>{
            if(err){
                res.status(404).send({
                    status: false,
                    msg : 'File Remove Fail..'
                }).end();
            } else {
                res.status(200).send({
                    status: true,
                    path: req.body.imgPath,
                    msg : 'File Remove Success'
                })
            }
        })
    } else {
        // 잘못된 이미지 경로인경우 에러 리턴.
        res.status(416).send({
            status: false,
            msg : 'Wrong img path..'
        })
    }
    
})

module.exports = router