

function goPage() {
    console.log("고고 페이지");
    location.href = './memoList';
}

// Id 유효성 검사.
function checkId() {
    const id = document.getElementById('id').value;

    if (id == null || id.length == 0) {
        return false;
    } else {
        return true;
    }
}

// Password 유효성 검사.
function checkPw(){
    const pw = document.getElementById('password').value;

    if(pw == null || pw.length < 4){
        return false;
    } else {
        return true;
    }
}

// 로그인!!
function goSignin(){
    if(checkId() && checkPw()){
        // 고고 로그인!
        return true;
    } else {
        alert('아이디 혹은 패스워드가 유효하지 않습니다.');
        // 비밀번호 값 재 세팅
        document.getElementById('password').value = "";
        return false;
    }
}
