const db = require('../db/db_config');
const aes = require('../utils/aesUtil');

const Memo = {

    /**
     * 메모 추가
     * @param {String} loginKey 사용자 로그인 키 값.
     * @param {Ojbect} body     tag, num, title, contents
     */
    addMemo: function (loginKey, body) {
        let userId = aes.dec(loginKey);
        console.log('UserId ' + userId);
        console.log(body.tag);
        console.log(body.title);
        console.log(body.description);

        let sql = 'INSERT INTO MEMO_TB (USER_ID,TAG,TITLE,CONTENTS,REGISTER_DATE)' +
            'VALUES(?,?,?,?,?,?)';
        let params = [userId, body.tag, body.title, body.description, new Date()];
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