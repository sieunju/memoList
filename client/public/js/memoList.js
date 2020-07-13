// [s] Memo List Options
let currentPage = 1;
let sortOption = '';
let filterOption = '';
let hasMore = false;
// [e] Memo List Options

let preScrollY;     // 이전 스크롤 Y 값.

let divFloating;    // 플로팅 버튼 View
let floatingMaxY;   // 플로팅 버튼 초기 Y 값.
let preFloatingY;   // 이전 플로팅 Y 값.
let floatingTransY; // 플로팅 현재 Y 축 좌표.

let divHeader;
let headerMaxY;
let preHeaderY;
let headerTransY;

let searchKeyWord;
let isSearchCall = false; // 검색 API 연속 호출 방지 변수
let isApiCall = false; // 추가 로딩 API 연속 호출 방지 변소.

window.onload = function () {
    doMemoList();

    divHeader = $('#header');
    headerMaxY = divHeader.outerHeight();
    preHeaderY = 0;
    headerTransY = 0;

    divFloating = $('#floating_btn');
    floatingMaxY = window.innerHeight - divFloating.offset().top;
    preScrollY = 0;
    floatingTransY = 0;
}

/**
 * Call MemoList
 * TYPE : GET
 * URL : api/memoList
 * {
 *  pageNo : 1,
 *  sortOpt : '태그 상위순', '태그 하위순', '최신순', '타이틀순'... 추후 예정.. -> defalut 태그 상위순 and 타이틀  
 *  filterOpt : 'tag 1만 보이도록?'
 * }
 */
function doMemoList() {

    isApiCall = true;
    let queryMap = new Object();
    queryMap.pageNo = currentPage;

    // 정렬 옵션 유효하면 값 추가.
    if (isValidString(sortOption)) {
        queryMap.sortOpt = sortOption;
    }

    // 필터 옵션 유효하면 값 추가.
    if (isValidString(filterOption)) {
        queryMap.filterOpt = filterOption;
    }

    // 검색 키워드 유효하면 값 추가.
    if (isValidString(searchKeyWord)) {
        queryMap.keyWord = searchKeyWord;
    }
    
    $.ajax({
        type: "GET",
        url: "./api/memo",
        data: queryMap,
        dataType: "JSON",
        success: function (json) {
            // console.log(json);
            // 데이터 없다.
            if ((json == null || json.dataList == null || json.dataList.length == 0) &&
                currentPage == 1) {
                $('#memo_list').empty();
                hasMore = false;
                console.log("데이터가 없습니다.");
                return;
            }

            // 첫 페이지인경우 이전에 있던 View 들 제거.
            if (currentPage == 1) {
                $('#memo_list').empty();
            }

            json.dataList.forEach(element => {
                // init View
                const divRoot = $('<div class="card-normal-bg" onclick=showDetail(this)></div>');
                let divTitle = $('<div id="card-title" class="card-normal-title"></div>');
                let divContents = $('<div id="card-contents" class="card-normal-contents"></div>');
                let hEtc = $('<h id="card-etc" class="etc-tags"></h>');
                let divTag = $('<div class="card-normal-tag tag_color"></div>');

                // DataBinding.
                divTitle.text(element.TITLE);
                divContents.html(element.CONTENTS);
                hEtc.text(element.MEMO_ID + "," + element.TAG);
                divTag.addClass('tag' + element.TAG);

                divRoot.append(divTitle);
                divRoot.append(divContents);
                divRoot.append(hEtc);
                divRoot.append(divTag);

                $('#memo_list').append(divRoot);
            });

            currentPage = json.pageNo;
            hasMore = json.hasMore;

            isApiCall = false;
        },
        error: function (xhr, status, error) {
            console.log(status, 'Error ' + error);
            isApiCall = false;
        }
    });
}

/*
 * Window Ready Listener Set.
 */
$(document).ready(function () {
    // 메모 수정 이벤트
    $('#update_memo').on('click', function () {
        const divDetail = $('#detail_root');
        updateData(divDetail);
    })

    // 메모 상세 내용 글자수 제한
    $(function () {
        $('#detail-title').keyup(function (e) {
            let content = $(this).val();
            if (content.length <= 40) {
                $('#title-counter').text(content.length + ' /40');
            }
        });
        $('#detail-title').keyup();

        $('#detail-contents').keyup(function (e) {
            let content = $(this).val();
            if (content.length <= 400) {
                $('#contents-counter').text(content.length + ' /400');
            }
        });
        $('#detail-contents').keyup();
    })

    // 검색어 이벤트
    $('#search_input').on("propertychange change keyup paste input", function () {
        searchKeyWord = $(this).val();

        // API Call 인경우 리턴
        if (isSearchCall) return;

        // API Call.
        // doKeyWord();
    })

    // 검색어 입력시
    $('#search_input').keydown(function (e) {
        if (e.keyCode == 13) {
            console.log("엔터키 누름!");
            // 키워드가 유효한 경우.
            if (isValidString(searchKeyWord)) {
                currentPage = 1;
                doMemoList();
            }
            // 검색어 없이 이동 클릭 한경우 초기화 처리.
            else {
                refresh();
            }
        }
    })

    // 검색 최소 버튼 클릭시
    $('#search_cancel').on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 400);
        $('#search_input').val('');

        const timer = setInterval(function () {
            console.log("다시 데이터 가져옵니다.");
            searchKeyWord = '';
            currentPage = 1;
            doMemoList();
            clearInterval(timer);
        }, 500);
    });
});

/*
 * 메모 상세 팝업창 보기
 */
function showDetail(divRoot) {

    // 부모 View 스크롤 방지
    scrollDisable();

    divRoot = $(divRoot);

    const title = divRoot.find('#card-title').text();
    let contents = divRoot.find('#card-contents').html();
    contents = contents.replace(/<br>/gi, '\n');
    const etc = divRoot.find('#card-etc').text().split(',');
    const memoId = Number(etc[0]);
    const tagColor = Number(etc[1]);

    const divDetailRoot = $('#detail_root');

    bindHeaderTag(tagColor);
    divDetailRoot.find('#detail-title').val(title);
    divDetailRoot.find('#title-counter').text(title.length + ' /40');
    divDetailRoot.find('#detail-contents').html(contents);
    divDetailRoot.find('#contents-counter').text(contents.length + ' /400');
    divDetailRoot.find('#etc_id').text(memoId);
    divDetailRoot.find('#etc_tag').text(tagColor);
    divDetailRoot.css("display", "block");
}

/*
 * 메모 상세 팝업 숨기기
 */
function showDetailHidden() {
    console.log("Click!!");
    $('#detail_root').css("display", "none");

    scrollAble();
}

/*
 * 선택한 태그 노출 처리하는 함수
 * @param tagValue : 선택한 태그값
 */
function bindHeaderTag(tagValue) {
    console.log("bindHeaderTag " + tagValue);
    $('#detail-header-tag').removeClass('tag1 tag2 tag3 tag4 tag5 tag6 tag7');
    $('#detail-header-tag').addClass('tag' + tagValue);

    $('#etc_tag').text(tagValue);
}

/*
 * 메모 데이터 업데이트
 */
function updateData(divDetail) {

    const title = divDetail.find('#detail-title').val();
    const contents = divDetail.find('#detail-contents').val().replace(/(?:\r\n|\r|\n)/g, '<br />');
    const memoId = Number(divDetail.find('#etc_id').text());
    const tagCd = Number(divDetail.find('#etc_tag').text());

    $.ajax({
        type: 'PUT',
        url: './api/memo',
        contentType: 'application/json; charset=utf-8',
        dataType: 'JSON',
        data: JSON.stringify({
            title: title,
            contents: contents,
            memo_id: memoId,
            tag: tagCd
        }),
        async: true,
        success: function (json) {
            console.log('Success json');
            refresh();
        },
        error: function (xhr, status, error) {
            console.log('Update Error Code ' + status + '  ' + error);
        }
    });
}

// 갱신 처리.
function refresh() {
    currentPage = 1;
    sortOption = '';
    filterOption = '';
    hasMore = false;
    window.location.reload();
}

// 검색 API 호출.
function doKeyWord() {
    // 빈 값인 경우 갱신 처리.
    if (searchKeyWord == null || searchKeyWord == "") {
        refresh();
        return;
    }

    isSearchCall = true;

    $.ajax({
        type: 'GET',
        url: './api/searchKeyword',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            keyword: searchKeyWord
        }),
        dataType: 'JSON',
        success: function (json) {
            isSearchCall = false;
            json.dataList.forEach(element => {
                console.log("Title " + element.TITLE);
            })
        },
        error: function (xhr, status, error) {
            isSearchCall = false;
            console.log("Search KeyWord Error " + error);
        }
    })
}

// 부모 스크롤 방지
function scrollDisable() {
    $('html, body').addClass('scroll-stop');
}

// 부모 스크롤 작동
function scrollAble() {
    $('html, body').removeClass('scroll-stop');
}

// 스크롤 이벤트
window.onscroll = function (ev) {
    let scrollOffset;

    // Safari Scroll Bounding 이슈 방어 코드.
    const scrollY = Math.max(0, window.scrollY);

    // Scroll Down..
    if (scrollY > preScrollY) {
        scrollOffset = preScrollY - scrollY;
        headerTransY += scrollOffset;
        floatingTransY -= scrollOffset;
    }
    // Scroll Up
    else {
        scrollOffset = scrollY - preScrollY;
        headerTransY -= scrollOffset;
        floatingTransY += scrollOffset;
    }


    // 헤더 최대값 고정 -35~ 0
    if (headerTransY < (-headerMaxY)) {
        headerTransY = -headerMaxY;
    } else if (headerTransY > 0) {
        headerTransY = 0;
    }

    // 변화 값이 있는경우 동작.
    if (preHeaderY != headerTransY) {
        divHeader.css('transform', 'translateY(' + headerTransY + 'px)');
        preHeaderY = headerTransY;
    }

    // 플로팅 최대값 고정.
    if (floatingTransY > floatingMaxY) {
        floatingTransY = floatingMaxY;
    }
    // 음수 고정.
    else if (floatingTransY < 0) {
        floatingTransY = 0;
    }

    // 변화 값이 있는경우 동작.
    if (preFloatingY != floatingTransY) {
        divFloating.css('transform', 'translateY(' + floatingTransY + 'px)');
        preFloatingY = floatingTransY;
    }

    // Scroll 값 저장.
    preScrollY = scrollY;

    // 페이징 처리
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // 데이터를 더 호출할수 있다면 추가 로딩
        if (hasMore && !isApiCall) {
            currentPage++;
            // console.log("Add Loading Current Page " + currentPage);
            doMemoList();
        }
    }
};

/**
 * 문자열 유효성 검사.
 * @param {String} tmpStr 
 */
function isValidString(tmpStr) {
    if (tmpStr == null || tmpStr == "") {
        return false;
    } else {
        return true;
    }
}