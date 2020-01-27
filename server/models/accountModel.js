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
        var sql = 'INSERT INTO ACT_USERS_TB (USER_ID,USER_KEY,USER_PW,REGISTER_DATE)' +
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
     * 사용자 체크 Query
     * @param {String} id 사용자 아이디
     */
    userCheck: function (id) {
        var sql = 'SELECT COUNT(*) as CNT FROM ACT_USERS_TB';
        db.getInstance().query(sql,function(err,rows,fields){
            if(err){
                console.log('Error ' + err);
            } else {
                console.log('TEST ' + JSON.stringify(rows));
            }
        })
    }
};

module.exports = User;