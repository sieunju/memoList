/**
 * 자주 사용하는 것들에 대한 유틸 클래스.
 */
const CryptoJS = require("crypto-js");

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

/**
 * 해당 API 가 APP 인지 판단하는 함수.
 * @parma {Object} req
 * @author hmju
 */
exports.isApp = function (req) {
    try {
        const type = req.header('req-type')
        return (type == 'APP');
    } catch (err) {
        console.log('isApp Err ' + err);
        return false;
    }
}

exports.getLoginKey = function(req) {
    try{
        // 앱인경우 헤더에서 login-key 를 가져온다.
        const reqType = req.header('req-type');

        if(reqType != null && reqType == 'APP'){
            console.log('App loginKey ' + req.header('req-login-key'));
            return req.header('req-login-key');
        } 
        // 웹에서 보낸경우 쿠키에서 loginKey 를 가져온다.
        else {
            let cookie = exports.cookieParser(req.headers.cookie);
            return cookie.loginKey;
        }
    }catch(err){
        console.log('getLoginKey Error' + err);
        return '';
    }
}

exports.reqInfo = function(req) {
    try{
        const reqType = req.header('req-type');
        // APP 인경우.
        if(reqType != null){
            return {
                osType: reqType,
                loginKey: req.header('req-login-key')
            } 

            // Android 인경우.
            if(reqType == 'AND'){
                return {
                    osType: 'AND',
                    loginKey: req.header('req-login-key')
                }
            } 
            // iOS 인경우
            else {
                return {
                    osType: "iOS",
                    loginKey: req.header('req-login-key')
                }
            }
        }
        // Web 인경우 쿠키에서 로그인 키값을 리턴함
        else {
            let cookie = exports.cookieParser(req.headers.cookie);
            return {
                loginKey: cookie.loginKey
            }
        }
    } catch(err){
        console.log("reqInfo Error " + err);
        return null;
    }
}