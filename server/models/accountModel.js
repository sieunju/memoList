const db = require('../db/db_config');
const utils = require('../utils/commandUtil');
const StringBuffer = require('stringbuffer');

const User = {

    /**
     * 사용자 추가 Query
     * @param form {Login Form}
     * user_id, user_pw, user_nm
     */
    postUser: function (form) {
        const loginKey = utils.enc(form.user_id);
        const sql = 'INSERT INTO ACT_USERS_TB (USER_NM,USER_ID,LOGIN_KEY,USER_PW,REGISTER_DATE)' +
            'VALUES(?,?,?,?,?)';
        const params = [form.user_nm, form.user_id, loginKey, form.user_pw, new Date()];
        db.getQuery(sql, params, function onMessage(err, rows) {
            if (err) {
                console.log('Error ' + err);
            } else {
                console.log('Sucees ' + rows.insertId);
            }
        })
    },

    /**
     * 사용자 정보 체크 로직.
     * @param {String} loginKey 
     * @param {function} callback 
     */
    fetchUser: function (loginKey, body, callback) {
        let userId = ''
        let userPw = ''
        const queryBuf = new StringBuffer();
        const paramsArr = new Array();

        if (utils.isEmpty(loginKey)) {
            userId = body.user_id
            userPw = body.user_pw
            queryBuf.append('SELECT USER_NM, RES_PATH, LOGIN_KEY ')
            queryBuf.append('FROM ACT_USERS_TB ')
            queryBuf.append('WHERE USER_ID=? ')
            queryBuf.append('AND ')
            queryBuf.append('USER_PW=? ')

            paramsArr.push(userId)
            paramsArr.push(userPw)
        } else {
            userId = utils.dec(loginKey)
            queryBuf.append('SELECT USER_NM, RES_PATH ')
            queryBuf.append('FROM ACT_USERS_TB ')
            queryBuf.append('WHERE USER_ID=? ')

            paramsArr.push(userId)
        }

        console.log("QUERY " + queryBuf.toString())
        console.log(paramsArr)
        db.getQuery(queryBuf.toString(), paramsArr, callback)
    },

    /**
     * 사용자 체크 하는 쿼리
     * @param {String} id  사용자 아이디
     * @param {String} pw 사용자 비밀번호 
     * @param {bool,String} callback DB 쿼리 진행후 콟백 하는 함수.
     */
    userCheck: function (id, pw, callback) {
        const sql = 'SELECT USER_ID,LOGIN_KEY FROM ACT_USERS_TB WHERE USER_ID=? and USER_PW=?';
        const params = [id, pw];
        db.getQuery(sql, params, function onMessage(err, rows) {
            if (err) {
                console.log('Error ' + err);
                callback(false, null);
            }
            // Success Query
            else {
                // 데이터 있는지 확인
                if (rows[0] != null) {
                    const userId = rows[0].USER_ID;
                    const loginKey = rows[0].LOGIN_KEY;
                    // 데이터 유효성 체크후 로그인 키값 전달
                    if (userId != null || loginKey != null) {
                        callback(true, loginKey);
                    }
                    // Error Call Back
                    else {
                        callback(false, null);
                    }
                }
                // Error Call Back
                else {
                    callback(false, null);
                }
            }
        });
    }
};

module.exports = User;