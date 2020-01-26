
const CryptoJS = require("crypto-js");

exports.enc = function(msg){
    return CryptoJS.AES.encrypt(JSON.stringify(msg),process.env.AES_KEY);
}

exports.dec = function(msg){
    var bytes = CryptoJS.AES.decrypt(msg.toString(),process.env.AES_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}