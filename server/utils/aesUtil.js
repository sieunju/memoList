
const CryptoJS = require("crypto-js");

/**
 * getter
 * AES_256 암호화. 
 */
exports.enc = function(msg){
    return '' + CryptoJS.AES.encrypt(JSON.stringify(msg),process.env.AES_KEY);
}

/**
 * getter 
 * AES_256 복호화
 */
exports.dec = function(msg){
    var bytes = CryptoJS.AES.decrypt(msg.toString(),process.env.AES_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}