const db = require('../db/db_config');
const utils = require('../utils/commandUtil');

const Memo = {

    /**
     * 메모 추가
     * @param {String} loginKey 사용자 로그인 키 값.
     * @param {Ojbect} body     tag, num, title, contents
     */
    addMemo: function (loginKey, body) {
        // 로그인 키로 사용자 아이디 값 복호화.
        const userId = utils.dec(loginKey);
        const description = body.description.replace(/(?:\r\n|\r|\n)/g, '<br />');
        console.log('UserId ' + userId);
        console.log(body.tag);
        console.log(body.title);
        console.log(body.description);
        const sql = 'INSERT INTO MEMO_TB (USER_ID,TAG,TITLE,CONTENTS,REGISTER_DATE)' +
            'VALUES(?,?,?,?,?)';
            const params = [userId, body.tag, body.title, description, new Date()];
        db.getQuery(sql, params, function onMessage(err, rows) {
            if (err) {
                console.log('Error ' + err);
            } else {
                console.log('Success ' + rows.insertId);
            }
        })
    },

    /**
     * 
     * @param {String} loginKey  사용자 로그인 키값. 
     * @param {Object} query     필터 옶션 및 정렬 기준
     */
    getMemo: function (loginKey,query,callBack){
        const userId = utils.dec(loginKey);
        // 페이지 20개씩 끊어서
        let pageNumber = query.pageNo;
        const pageSize = 20;
        const sql = 'SELECT TAG, TITLE, CONTENTS FROM MEMO_TB WHERE USER_ID=? ' + 
        'ORDER BY TAG, TITLE ASC LIMIT ?,?';
        const params = [userId,pageNumber,pageSize];
        db.getQuery(sql,params,callBack);
    }
};

module.exports = Memo;