/**
 * 자주 사용하는 것들에 대한 유틸 클래스.
 */
const CryptoJS = require("crypto-js");

/**
 * getter
 * AES_256 암호화. 
 * @param {String} msg 암후화 하고싶은 문자열
 */
exports.enc = function (msg) {
    return '' + CryptoJS.AES.encrypt(JSON.stringify(msg), process.env.AES_KEY);
}

/**
 * getter 
 * AES_256 복호화
 * @param {String} msg 암호화된 문자열
 */
exports.dec = function (msg) {
    const bytes = CryptoJS.AES.decrypt(msg.toString(), process.env.AES_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

/**
 * Header Cookie 값 파싱 해주는 함수.
 * @param {String} cookie
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