// 데이터 베이스 설정 
var mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    connectionLimit: 10
}); 
module.exports = (function () {
    return {
        init: function () {
            con.connect(function (err) {
                if (err) throw err;
                console.log("MySql Database Connected!");

                // var sql = 'INSERT INTO ACT_USERS_TB (USER_ID,USER_KEY,USER_PW,REGISTER_DATE)' +
                //     'VALUES(?,?,?,?)';
                // var params = ['qtzz772', '11212121eefef', 'qqqqpw',new Date()];
                // console.log("TEST " + params.toString());
                // con.query(sql, params, function (err, rows, fields) {
                //     console.log("TTTT " + fields);
                //     if (err) {
                //         console.log(err);
                //     } else {
                //         console.log(rows.insertId);
                //     }
                // });

                // DB 연결 완료후 Table 생성.
                /**
                 * USER_ID          -> 사용자 아이디 PK
                 * USER_KEY         -> 사용자 식별 (암호화)
                 * USER_PW          -> 사용자 비밀 번호
                 * REGISTER_DATE    -> 사용자 등록 날짜 
                 */
                // var sqlQuery = "CREATE TABLE ACT_USERS_TB (" +
                //     "USER_ID VARCHAR(30) PRIMARY KEY," +
                //     "USER_KEY VARCHAR(200) NOT NULL," +
                //     "USER_PW VARCHAR(40)," +
                //     "REGISTER_DATE DATETIME" +
                //     ")";

                // // Account Table Create
                // con.query(sqlQuery, function (err, result) {
                //     if (err) {
                //         console.log("Create Account Table Error " + err);
                //     } else {
                //         console.log("Account Table Created");
                //     }
                // });

                // /**
                //  * USER_ID          -> 사용자 아이디 PK
                //  * TAG              -> 우선 순위에 대한 테그
                //  * TITLE            -> 제목
                //  * CONTENTS         -> 내용
                //  * REGISTER_DATE    -> 등록 날짜 DATETIME
                //  */
                // sqlQuery = "CREATE TABLE MEMO_TB (" +
                //     "USER_ID VARCHAR(30) PRIMARY KEY," +
                //     "TAG SMALLINT," +
                //     "TITLE VARCHAR(200)," +
                //     "CONTENTS VARCHAR(800)," +
                //     "REGISTER_DATE DATETIME" +
                //     ")";

                // // Memo Table Create
                // con.query(sqlQuery, function (err, result) {
                //     if (err) {
                //         console.log("Create Memo Table Error " + err);
                //     } else {
                //         console.log("Memo Table Created");
                //     }
                // });
            });
        },
        getInstance : function () {
            return con;
        }
        
    }
})();