const db = require('../db/db_config');
const utils = require('../utils/commandUtil');
const StringBuffer = require('stringbuffer');
const fs = require('fs');

const Upload = {

    /**
     * Memo Add File Query
     * @param {Integer} memoId  메모 아이디
     * @param {String} filePath 리소스 파일 경로
     * @param {Function} callBack  Query 실행후 리턴하는 CallBack 함수.
     */
    addFile: function (memoId, filePath, callBack) {
        const query = 'INSERT INTO MEMO_FILE_TB (MEMO_ID, RESOURCE_PATH, REGISTER_DATE) VALUES (?,?,?)'
        const params = [memoId, filePath, new Date()]

        db.getQuery(query, params, callBack)
    },

    /**
     * 
     * @param {Integer} fileId 파일 아이디
     * @param {String} filePath 리소스 파일 경로
     * @param {Function} callBack Query 실행후 리턴하는 CallBack 함수.
     */
    deleteFile: function (fileId, filePath, callBack) {
        const query = 'DELETE FROM MEMO_FILE_TB WHERE (UID=? AND RESOURCE_PATH=?)'
        const params = [fileId,filePath]
        db.getQuery(query,params,callBack)
    },

    deleteFiles: function (manageNoList, pathList, callBack) {
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