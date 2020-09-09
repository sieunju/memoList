// 데이터 베이스 설정 
const mysql = require('mysql');
const mysqlConfig = {
    host: 'localhost',
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    dateStrings: 'date'
}

const pool = mysql.createPool(mysqlConfig);

module.exports = (function () {
    return {
        init: function () {
            pool.getConnection(function (err, con) {
                if (err) {
                    // con.release();
                    throw err;
                }
                console.log("MySql Database Connected!");
                let sqlQuery;
                // randomMemo(con);

                // DB 연결 완료후 Table 생성.
                /**
                 * USER_ID          -> 사용자 아이디 PK
                 * LOGIN_KEY        -> 사용자 식별 (암호화)
                 * USER_PW          -> 사용자 비밀 번호
                 * REGISTER_DATE    -> 사용자 등록 날짜 
                 */
                sqlQuery = "CREATE TABLE ACT_USERS_TB (" +
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
                 * USER_ID          -> 사용자 아이디
                 * MEMO_ID          -> 메모 아이디 (AUTO_INCREMENT)
                 * TAG              -> 우선 순위에 대한 테그
                 * INDEX            -> 같은 태그에서도 순서를 정하기 위한 값(추후 값 세팅할 예정)
                 * TITLE            -> 제목
                 * CONTENTS         -> 내용
                 * IMAGES           -> 메모 이미지 최대 4장
                 * REGISTER_DATE    -> 등록 날짜 DATETIME
                 */
                sqlQuery = "CREATE TABLE MEMO_TB (" +
                    "USER_ID VARCHAR(30) NOT NULL," +
                    "MEMO_ID SMALLINT NOT NULL AUTO_INCREMENT PRIMARY KEY," +
                    "TAG SMALLINT," +
                    "NUM SMALLINT," +
                    "TITLE VARCHAR(200) NOT NULL," +
                    "CONTENTS VARCHAR(800) NOT NULL," +
                    "IMAGES VARCHAR(500) NULL," +
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

                /**
                 * OS_TYPE              -> APP OS 정보
                 * CURRENT_VERSION_NM   -> 현재 버전 (이름)
                 * CURRENT_VERSION_CD   -> 현재 버전 (코드)
                 * LATE_VERSION_NM      -> 최신 버전 (이름)
                 * LATE_VERSION_CD      -> 최신 버전 (코드)
                 */
                sqlQuery = "CREATE TABLE APP_VERSION_TB (" +
                    "OS_TYPE VARCHAR(10) NOT NULL," +
                    "CURRENT_VERSION_NM VARCHAR(20)," +
                    "CURRENT_VERSION_CD SMALLINT," +
                    "LATE_VERSION_NM VARChAR(20)," +
                    "LATE_VERSION_CD SMALLINT" +
                    ")";
                // APP Info Table Create
                con.query(sqlQuery, function (err, result) {
                    if (err) {
                        console.log("Create App Version Table Error " + err);
                    } else {
                        console.log("App Version Created");
                    }
                });

                // randomMemo(con)

                /**
                 * 데이터 베이스 기본 언어 변경
                 */
                // sqlQuery = "ALTER DATABASE DB_MEMO DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci";
                // // Database 언어 변경
                // con.query(sqlQuery,function(err,result){
                //     if (err) {
                //         console.log("Database Alter Error " + err);
                //     } else {
                //         console.log("Database Alter Success");
                //     }
                // });

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

/// [S] TEST CODE ====================================================================================
function randomMemo(con) {
    const sqlQuery = 'INSERT INTO MEMO_TB (USER_ID,TAG,TITLE,CONTENTS,IMAGES,REGISTER_DATE)' +
        'VALUES (?,?,?,?,?,?)';
    for (let i = 0; i < 100; i++) {
        const params = ['test', 
        (Math.random() * 7 + 1),
            makeid(), 
            'Message\t' + makeid(),
            makeImage(),
            new Date()];
        con.query(sqlQuery, params, function (err, rows) {
            if (err) {
                console.log('Dump Err' + err);
            } else {
                console.log('Dump Success ' + rows.insertId);
            }
        })
    }
}

function makeImage (){
    let text = "";
    const ran = Math.floor(Math.random() * 100)

    if(ran % 2 == 0 ) {
        return null
    } else {
        const arr = [];
        arr.push("IMG_1594645069528uibrhjcizvf.jpeg")
        arr.push("IMG_1594645115336nywr85bdph.jpeg")
        arr.push("IMG_1595895721787p0rnmvea02i.jpeg")
        arr.push("IMG_1595897676051afk1j1b40cc.jpeg")
        arr.push("IMG_15946450230737kkbsc1gw6f.jpeg")
        arr.push("IMG_15946451114253y84tk1t2cu.jpeg")
        arr.push("IMG_15947989553665us6sahoh98.jpeg")

        const tmpArr = [];

        for(let i = 0; i < getRanRange(3,false); i++) {
            tmpArr.push(arr[getRanRange(arr.length)])
        }

        console.log(JSON.stringify(tmpArr))
        return JSON.stringify(tmpArr)
    }
}

function getRanRange(range) {
    return getRanRange(range,true)
}

function getRanRange(range,isZero) {
    if(isZero) {
        return Math.floor(Math.random() * range)
    } else {
        return Math.floor(Math.random() * range + 1)
    }
}

function makeid() {
    let text = "";
    const possible = "가나다라보미디뱌추퍼즐거운바람의나라뿌잉뼈뺑뺭뿅주홍민박민진";

    for (let i = 0; i < 20; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        if (i % 5 == 0) {
            text += '\n';
        }
    }

    return text;
}
/// [E] TEST CODE ====================================================================================
