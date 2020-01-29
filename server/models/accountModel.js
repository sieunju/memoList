var db = require('../db/db_config');

var User = {

    /**
     * 사용자 추가 Query
     * @param {String} id 사용자 아이디
     * @param {String} pw 사용자 비밀 번호
     */
    addUser: function (id, pw) {
        var aes = require('../utils/aesUtil');
        var loginKey = aes.enc(id);
        var sql = 'INSERT INTO ACT_USERS_TB (USER_ID,LOGIN_KEY,USER_PW,REGISTER_DATE)' +
            'VALUES(?,?,?,?)';
        var params = [id, loginKey, pw, new Date()];
        db.getInstance().query(sql, params, function (err, rows, fields) {
            if (err) {
                console.log('Error ' + err);
            } else {
                console.log('Sucees ' + rows.insertId);
            }
        })
    },

    /**
     * 사용자 체크 하는 쿼리
     * @param {String} id  사용자 아이디
     * @param {String} pw 사용자 비밀번호 
     * @param {bool,String}} callback DB 쿼리 진행후 콟백 하는 함수.
     */
    userCheck: function (id, pw, callback) {
        var sql = 'SELECT USER_ID,LOGIN_KEY FROM ACT_USERS_TB WHERE USER_ID=? and USER_PW=?';
        var params = [id, pw];
        db.getInstance().query(sql, params, function (err, rows, fields) {
            if (err) {
                console.log('Error ' + err);
                callback(false, null);
            }
            // Success Query
            else {
                // 데이터 있는지 확인
                if (rows[0] != null) {
                    var userId = rows[0].USER_ID;
                    var loginKey = rows[0].LOGIN_KEY;
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
        })
    }
};

module.exports = User;