

const response = (isSuccess,msg,data) => {
    return {
        status: isSuccess,
        errMsg: msg
    }
}


module.exports = response