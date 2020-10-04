const db = require('../db/db_config');
const utils = require('../utils/commandUtil');
const StringBuffer = require('stringbuffer');
const fs = require('fs');

const Upload = {

    /**
     * DB에 파일들을 추가후 다시 파일들의 정보를 가져온다. 
     * 앱에 해당 정보를 노출하기 위함.
     * @param {FileList} fileArr 
     * @param {Object} body 
     * @param {Listener} callBack 
     */
    addFiles: function (fileArr, body, callBack) {
        const memoId = body.memoId
        console.log('Body ' + memoId)
        const queryBuf = new StringBuffer()
        const paramsArr = new Array()

        queryBuf.append('INSERT INTO MEMO_FILE_TB (MEMO_ID, RESOURCE_PATH, REGISTER_DATE) ')
        queryBuf.append('VALUES ')

        for (let i = 0; i < fileArr.length; i++) {
            let filePath = fileArr[i].path
            paramsArr.push(memoId)
            paramsArr.push(filePath)
            paramsArr.push(new Date())
            queryBuf.append('(?,?,?)')

            if (i != fileArr.length - 1) {
                queryBuf.append(', ')
            }
        }

        db.getQuery(queryBuf.toString(), paramsArr, function onMessage(err, rows) {
            // 에러 발생시..
            if (err) {
                callBack.onMessage(err, -1)
            } else {
                // 음...이렇게 안하고 다른 방법이 있을거 같은데..애매하네...좀더 공부하고 작업 예정.
                console.log('File Add Sql=================================')
                console.log(rows)
                console.log('File Add Sql=================================')
                // 추가된 파일을 다시 검색해서 가져온다.
                const queryBuf = new StringBuffer()
                const paramsArr = new Array()

                queryBuf.append('SELECT UID, RESOURCE_PATH FROM MEMO_FILE_TB WHERE ')

                for (let i = 0; i < fileArr.length; i++) {
                    queryBuf.append('RESOURCE_PATH=? ')
                    paramsArr.push(fileArr[i].path)

                    if (i != fileArr.length - 1) {
                        queryBuf.append(' OR ')
                    }
                }

                // 추가된 파일 데이터 가져오기.
                db.getQuery(queryBuf.toString(), paramsArr, callBack)
            }
        })
    },

    deleteFile: function (manageNoList, pathList, callBack) {
        console.log(pathList)
        const queryBuf = new StringBuffer()
        const paramsArr = new Array()

        queryBuf.append('DELETE FROM MEMO_FILE_TB WHERE ')
        for (let i = 0; i < pathList.length; i++) {
            queryBuf.append('(UID=? AND RESOURCE_PATH=?)')
            paramsArr.push(manageNoList[i])
            paramsArr.push(pathList[i])

            if (i != pathList.length - 1) {
                queryBuf.append(' OR ')
            }
        }

        db.getQuery(queryBuf.toString(), paramsArr, callBack)
    }
};

module.exports = Upload;