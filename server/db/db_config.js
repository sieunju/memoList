// 데이터 베이스 설정 
const mysql = require('mysql');
const mysqlConfig = {
    host: 'localhost',
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    connectionLimit: 10
}
const pool = mysql.createPool(mysqlConfig);

module.exports = (function () {
    return {
        init: function () {
            pool.getConnection(function (err, con) {
                if (err) {
                    con.release();
                    throw err;
                }
                console.log("MySql Database Connected!");
                // DB 연결 완료후 Table 생성.
                /**
                 * USER_ID          -> 사용자 아이디 PK
                 * LOGIN_KEY        -> 사용자 식별 (암호화)
                 * USER_PW          -> 사용자 비밀 번호
                 * REGISTER_DATE    -> 사용자 등록 날짜 
                 */
                let sqlQuery = "CREATE TABLE ACT_USERS_TB (" +
                    "USER_ID VARCHAR(30) PRIMARY KEY," +
                    "LOGIN_KEY VARCHAR(200) NOT NULL," +
                    "USER_PW VARCHAR(40)," +
                    "REGISTER_DATE DATETIME" +
                    ")";
                // Account Table Create
                con.query(sqlQuery, function (err, rows) {

                    if (err) {
                        console.log("Create Account Table Error " + err);
                    } else {
                        console.log("Account Table Created");
                    }
                });

                /**
                 * USER_ID          -> 사용자 아이디 PK
                 * TAG              -> 우선 순위에 대한 테그
                 * INDEX            -> 같은 태그에서도 순서를 정하기 위한 값(추후 값 세팅할 예정)
                 * TITLE            -> 제목
                 * CONTENTS         -> 내용
                 * REGISTER_DATE    -> 등록 날짜 DATETIME
                 */
                sqlQuery = "CREATE TABLE MEMO_TB (" +
                    "USER_ID VARCHAR(30) PRIMARY KEY," +
                    "TAG SMALLINT," +
                    "NUM SMALLINT," +
                    "TITLE VARCHAR(200)," +
                    "CONTENTS VARCHAR(800)," +
                    "REGISTER_DATE DATETIME" +
                    ")";
                // Memo Table Create
                con.query(sqlQuery, function (err, result) {
                    if (err) {
                        console.log("Create Memo Table Error " + err);
                    } else {
                        console.log("Memo Table Created");
                    }
                });

                // Pool에 Connection을 반납 
                con.release();
                // 1시간 단위로 Ping 떄림.
                setInterval(keepAlive, 60 * 60 * 1000);
            });
        },

        /**
         * Query 문 처리하는 함수.
         * 파라미터가 존재하지 않는 타입.
         * @param {String} query  DB Query
         * @param {bool,rows} callBack Query Callbakc Listener
         */
        getQuery: function (query, callBack) {
            pool.getConnection(function (err, con) {
                con.query(query, function (err, rows) {
                    callBack(err, rows);
                    // Pool에 Connection을 반납 
                    con.release();
                })
            })
        },

        /**
         * Query 문 처리하는 함수.
         * 파라미터가 존재하는 타입.
         * @param {String} query    DB Query
         * @param {String []} params  Parameter ex.) '?'
         * @param {bool,rows} callBack  Query Callbakc Listener
         */
        getQuery: function (query, params, callBack) {
            pool.getConnection(function (err, con) {
                con.query(query, params, function (err, rows) {
                    callBack(err, rows);
                    // Pool에 Connection을 반납 
                    con.release();
                })
            })
        }
    }
})();

// Mysql 특성상 8시간 지나면 자동으로 연결을 해제하는 이슈가 있음.
// 한시간 단위로 연결을 유지하도록 하는 함수.
function keepAlive() {
    pool.getConnection(function (err, con) {
        if (err) { return; }
        console.log('Ping!!');
        con.ping();
        // Pool에 Connection을 반납 
        con.release();
    });
    // redis client 사용중이라면 여기서 client.ping(); 하여 연결을 유지한다.
}