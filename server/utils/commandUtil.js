/**
 * 자주 사용하는 것들에 대한 유틸 클래스.
 */
const CryptoJS = require("crypto-js");
const logger = require("../utils/winston");

/**
 * getter
 * AES_256 암호화. 
 * @param {String} msg 암후화 하고싶은 문자열
 * @author hmju
 */
exports.enc = function (msg) {
    return '' + CryptoJS.AES.encrypt(JSON.stringify(msg), process.env.AES_KEY);
}

/**
 * getter 
 * AES_256 복호화
 * @param {String} msg 암호화된 문자열
 * @author hmju
 */
exports.dec = function (msg) {
    const bytes = CryptoJS.AES.decrypt(msg.toString(), process.env.AES_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

/**
 * Header Cookie 값 파싱 해주는 함수.
 * @param {String} cookie
 * @author hmju
 */
exports.cookieParser = function (cookie = '') {
    return cookie
        .split(';')
        .map(v => v.split('='))
        .map(([k, ...vs]) => [k, vs.join('=')])
        .reduce((acc, [k, v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});
}

/**
 * UTF-8 인코딩
 * @param {String} str
 * @author hmju
 */
exports.encode_utf8 = function (str) {
    return encodeURIComponent(str);
}

/**
 * UTF-8 디코딩
 * @param {String} str
 * @author hmju
 */
exports.decode_utf8 = function (str) {
    return decodeURIComponent(str);
}

/**
 * 문자열 유효성 검사.
 * @param {String} str
 * @author hmju
 */
exports.isValidString = function (str) {
    return !(str == null || str == "");
}

exports.isValidInt = function (value) {
    return !(value == null)
}

/**
 * Request 정보 가져오기.
 * APP 인경우 
 */
exports.reqInfo = function (req) {
    try {
        const reqType = req.header(process.env.HEADER_TYPE);
        // APP 인경우.
        if (reqType != null) {
            return {
                osType: reqType,
                loginKey: req.header(process.env.HEADER_LOGIN)
            }
        }
        // Web 인경우 쿠키에서 로그인 키값을 리턴함
        else {
            let cookie = exports.cookieParser(req.headers.cookie);
            return {
                loginKey: cookie.loginKey
            }
        }
    } catch (err) {
        console.log("reqInfo Error " + err);
        return null;
    }
}

/**
 * CmmInfo 에서 앱인지 아닌지 판별
 */
exports.isApp = function (cmmInfo) {
    try {
        if (cmmInfo.osType != null) {
            if (cmmInfo.osType == 'AND' || cmmInfo.osType == 'iOS') {
                return true
            }
        }
        return false
    } catch (err) {
        return false
    }
}

/**
 * 운영 및 개발 버전에 따라서 로그 분기 처리.
 * @param {String} msg 
 */
exports.logD = function (msg) {
    // try {
    //     if (process.env.BUILD_TYPE == 'RELEASE') {
    //         logger.info(msg);
    //     } else {
    //         logger.debug(msg);
    //     }
    // } catch (err) {

    // }
}

exports.logFileReq = function (any) {
    // try {
    //     logger.info('Request File\n[Headers]\n' + JSON.stringify(any.rawHeaders) + '\n\n[File]\n' + JSON.stringify(any.file));
    // }catch(err){

    // }
}

exports.logFileRes = function (any) {
    // try {
    //     logger.info('Response File\n[Headers]\n' + any.response + '\n\n[Client]\n' + any.client);
    // }catch(err){

    // }
}

exports.logE = function (msg) {
    // try {
    //     if (process.env.BUILD_TYPE == 'RELEASE') {
    //         logger.error(msg);
    //     } else {
    //         logger.error(msg);
    //     }
    // } catch (err) {

    // }
}

/**
 * 디렉토리 체크 로직
 * @param {string} path 
 * @param {function} callback 
 */
const isDir = (fs, path, callback) => {
    fs.stat(path, (err, stats) => {
        if (err && err.code === 'ENOENT')
            return callback(null, true);
        if (err)
            return callback(err);

        return callback(null, !stats.isDirectory());
    });
}

exports.checkDir = function (fs, path, callback) {
    isDir(fs, path, (err, isTrue) => {
        if (err) {
            if(callback == null){
                return console.log(err);
            } else {
                return callback(false, '에러!' + err);
            }
        }

        if (!isTrue) {
            if(callback == null){
                return console.log('이미 동일한 디렉토리가 있습니다. ' + path);
            } else {
                return callback(true, '이미 동일한 디렉토리가 있습니다.' + path);
            }
        }

        fs.mkdir(path, (err) => {
            if (err) {
                if(callback == null){
                    return console.log(err);
                } else {
                    return callback(false, err);
                }
            }

            // 디렉토리 생성 완료.
            if(callback == null){
                return console.log('디렉토리 생성 완료 ' + path);
            } else {
                return callback(true, path);
            }
        })
    })
}