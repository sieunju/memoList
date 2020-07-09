const appRoot = require('app-root-path');   // app root 경로를 가져오는 lib
const winston = require('winston');         // winston lib
require('winston-daily-rotate-file')        // log 파일을 일자별로 생성하기 위해 사용
const format = require('path');
const write = require('fs');

const { combine, timestamp, label, printf } = winston.format;

const dailyRotateFileTrans = new winston.transports.DailyRotateFile({
    level: 'debug',
    filename: `${appRoot}/logs/memo-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '500m',
    maxFiles: '14d'
})

// 우선 나중에 message 패턴중 날짜 포멧 없애는 쪽으로 할 예정.
const customFmt = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = winston.createLogger({
    level: "debug",
    format: combine(
        timestamp({
            format: 'YYYY. MM. DD HH:mm:ss',
        }),
        customFmt,
    ),
    transports: [
        new winston.transports.Console(),
        dailyRotateFileTrans
    ]
})

logger.stream = {
    write: function (message, encoding) {
        logger.debug(message);
    }
}

module.exports = logger;
