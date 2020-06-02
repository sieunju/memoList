const db = require('../db/db_config');
const utils = require('../utils/commandUtil');
const StringBuffer = require('stringbuffer');

const App = {
    
    /**
     * 
     * @param {App Info} appInfo 
     * @param {listener} callBack  Query 문 수행후 콜백 하는 리스너.
     */
    versionCheck: function(appInfo, callBack){
        
        // [s] SQL Query
        const queryBuf = new StringBuffer();
        const paramsArr = new Array();
        queryBuf.append('SELECT * FROM APP_VERSION_TB ');
        queryBuf.append('WHERE OS_TYPE=? ')

        // 안드로이드인 경우.
        if(appInfo.osType == 'AND'){
            paramsArr.push('AND');
        } 
        // iOS 인경우.
        else if(appInfo.osType == 'iOS'){
            paramsArr.push('iOS');
        } 
        // 유효하지 않은 타입인경우.
        else {
            callBack.onMessage('유효하지 않은 OS 입니다.',null)
            return
        }
        db.getQuery(queryBuf.toString(),paramsArr,callBack);

    }
};

module.exports = App;

