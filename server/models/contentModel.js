const db = require('../db/db_config');
const aes = require('../utils/aesUtil');

const Memo = {

    /**
     * 메모 추가
     * @param {String} loginKey 사용자 로그인 키 값.
     * @param {Ojbect} form     tag, num, title, contents
     */
    addMemo: function (loginKey, form) {
        let userId = aes.dec(loginKey);
        console.log('UserId ' + userId);
        let sql = 'INSERT INTO MEMO_TB (USER_ID,TAG,NUM,TITLE,CONTENTS,REGISTER_DATE)' +
            'VALUES(?,?,?,?,?,?)';
        let params = [userId, form.tag, form.num, form.title, form.contents, new Date()];
        db.getQuery(sql, params, function onMessage(err, rows) {
            if (err) {
                console.log('Error ' + err);
            } else {
                console.log('Success ' + rows.insertId);
            }
        })
    }
};

module.exports = Memo;