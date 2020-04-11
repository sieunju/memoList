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
        const contents = body.contents.replace(/(?:\r\n|\r|\n)/g, '<br />');
        console.log('UserId ' + userId);
        console.log(body.tag);
        console.log(body.title);
        console.log(body.contents);
        const sql = 'INSERT INTO MEMO_TB (USER_ID,TAG,TITLE,CONTENTS,REGISTER_DATE)' +
            'VALUES(?,?,?,?,?)';
        const params = [userId, body.tag, body.title, contents, new Date()];
        db.getQuery(sql, params, function onMessage(err, rows) {
            if (err) {
                console.log('Error ' + err);
            } else {
                console.log('Success ' + rows.insertId);
            }
        })
    },

    /**
     * 사용자에 맞는 메모 리스트 가져오기
     * @param {String} loginKey  사용자 로그인 키값. 
     * @param {Object} query     필터 옶션 및 정렬 기준
     */
    getMemo: function (loginKey, query, callBack) {
        const userId = utils.dec(loginKey);
        const pageSize = 10; // 한번 불러올 데이터 양 고정

        // PageIndex 계산 ex.) 0, 20, 40, 60...
        let pageIndex = (query.pageNo - 1) * pageSize;

        // ASC 오름차순 오른쪽으로 갈수록 커진다.   
        const sql = 'SELECT TAG, MEMO_ID, TITLE, CONTENTS FROM MEMO_TB WHERE USER_ID=? ' +
            'ORDER BY TAG, TITLE ASC LIMIT ?,?';
        const params = [userId, pageIndex, pageSize];
        db.getQuery(sql, params, callBack);
    },

    /**
     * 메모값 수정
     * @param {String} loginKey 사용자 로그인 키값.
     * @param {Object} body memo_id, tag, title, contents 
     */
    updateMemo: function (loginKey, body, callBack) {
        // 데이터 유효성 검사.
        if(body.memo_id == null) return;

        console.log('Id ' + body.memo_id);
        console.log('Tag ' + body.tag);
        console.log('Title ' + body.title);
        console.log('Contents ' + body.contents);

        const contents = body.contents.replace(/(?:\r\n|\r|\n)/g, '<br />');

        const sql = 'UPDATE MEMO_TB SET TAG=?, TITLE=?, CONTENTS=?, REGISTER_DATE=? WHERE MEMO_ID=?';
        const params = [body.tag,body.title,contents,new Date(),body.memo_id];
        db.getQuery(sql,params,callBack);
    }
};

module.exports = Memo;