// 글자수 보여지도록..
$(document).ready(function() {
    $('input#title, textarea#description').characterCounter();
});

// 추가할 데이터 유효성 체크.
function checkMemo() {

    // 테그 정보 get.
    const tagList = document.getElementsByName('tag');

    let selectedTag;
    for (var i = 0; i < tagList.length; i++) {
        if (tagList[i].checked) {
            selectedTag = tagList[i];
            break;
        }
    }

    // 타이틀 get
    const title = document.getElementById('title');

    // 내용 get
    let contents = document.getElementById('contents').value;
    contents = contents.replace(/(?:\r\n|\r|\n)/g, '<br />');
    console.log('값' + contents);
    alert('선택한 값 ' + contents);
    return true;
}

function addMemo() {
    // // 테그 정보 get.
    // const tagList = document.getElementsByName('tag');

    // var selectedTag;
    // for (var i = 0; i < tagList.length; i++) {
    //     if (tagList[i].checked) {
    //         selectedTag = tagList[i];
    //         break;
    //     }
    // }

    // // 타이틀
    // const title = document.getElementById('title');
    // 내용 <br/> 로 변경
    let contents = document.getElementById('contents').value;
    contents = description.replace(/(?:\r\n|\r|\n)/g, '<br />');
    document.getElementById('contents').value = contents;
    return true;
}

// 타이틀 엔터키 방지 로직
document.getElementById('title').addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 13:
            // 엔터 키 방지.
            event.preventDefault();
            break;
    }
})

// 취소 버튼 클릭시.
document.getElementById('btn-cancel').onclick = function() {
    // alert("취소 취소");
    history.back();
}