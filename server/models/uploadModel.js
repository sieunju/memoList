const db = require('../db/db_config');
const utils = require('../utils/commandUtil');
const StringBuffer = require('stringbuffer');
const fs = require('fs');

const Upload = {

    addFiles : function(fileArr, body, callBack) {
        const memoId = body.memoId
        console.log('Body ' + memoId)
        const queryBuf = new StringBuffer()
        const paramsArr = new Array()

        queryBuf.append('INSERT INTO MEMO_FILE_TB (MEMO_ID, RESOURCE_PATH, REGISTER_DATE) ')
        queryBuf.append('VALUES ')
        
        for(let i = 0; i < fileArr.length; i++) {
            let filePath = fileArr[i].path
            paramsArr.push(memoId)
            paramsArr.push(filePath)
            paramsArr.push(new Date())
            queryBuf.append('(?,?,?)')

            if(i != fileArr.length - 1) {
                queryBuf.append(', ')
            }
        }
        
        db.getQuery(queryBuf.toString(),paramsArr,callBack)
    },
    
    deleteFile: function(body,callBack) {
        const query = 'DELETE FROM MEMO_FILE_TB WHERE RESOURCE_PATH = ?'
        db.getQuery(query,body.resPath,callBack)
    }
};

module.exports = Upload;