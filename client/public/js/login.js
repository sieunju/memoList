

function goPage() {
    console.log("고고 페이지");
    location.href = './memoList';
}

// Id 유효성 검사.
function checkId() {
    const id = document.getElementById('id').value;

    if (id == null || id.length == 0) {
        alert('Not Valid Id!!');
        return false;
    } else {
        return true;
    }
}

// Password 유효성 검사.
function checkPw(){
    const pw = document.getElementById('password').value;

    if(pw == null || pw.length < 4){
        alert('Not Valid Password!!');
        return false;
    } else {
        return true;
    }
}

// 로그인 버튼 이벤트
document.getElementById('btn-login').onclick = function () {
    if(checkId() && checkPw()){
        const id = document.getElementById('id').value;
        const pw = document.getElementById('password').value;

        alert('입력한 값 ' + id + "  " + pw);
    } else {
        alert('아이디 혹은 패스워드가 유효하지 않습니다.');
        
        // 비밀번호 값 재 세팅
        document.getElementById('password').value = "";
    }
}

