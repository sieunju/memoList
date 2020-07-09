/**
 * 파일 업로드 관련 라우터
 * Visual Studio 줄 정렬 -> Shift + Option + F
 * Created by hmju
 */
const express = require('express');
const multer = require('multer');
const utils = require('../utils/commandUtil');
const path = require('path');

const storage = multer.diskStorage({
    // 서버에 저장할 폴더 생성.
    destination: function (req, file, callback) {
        
        utils.logD("File Path Setting " + file.mimetype);

        switch (file.mimetype) {
            case 'image/png':
            case 'image/jpeg':
                callback(null, 'resource/img')
                break;
            case 'text/plain':
                callback(null, 'resource/txt')
                break;
            case 'resource/etc':
                callback(null, 'resource/etc')
                break;

        }
    },
    // 서버에 저장할 파일명
    filename: function (req, file, callback) {
        let extension = path.extname(file.originalname);
        let basename = path.basename(file.originalname, extension)
        let loginKey = utils.reqInfo(req).loginKey
        utils.logD("File Path " + file.path);
        callback(null, Date.now() + '_file' + extension);
    }
});
const upload = multer({ storage: storage });

const router = express.Router();

router.get('/upload', (req, res) => {
    res.render('dummyUpload.html');
})

router.post('/uploads', upload.single('file'), (req, res) => {
    console.log(res);
    utils.logFileReq(req);
    utils.logFileRes(res);
    res.send()
})

module.exports = router