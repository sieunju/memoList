let currentPage = 1;
let sortOption = '';
let filterOption = '';
let hasMore = false;

window.onLoad = getMemoList();

/**
 * 필터 및 옵션에 따라서 메모 리스트 가져오기.
 */
function getMemoList() {

    /**
     * TYPE : GET
     * URL : api/memoList
     * {
     *  pageNo : 1,
     *  sortOpt : '태그 상위순', '태그 하위순', '최신순', '타이틀순'... 추후 예정.. -> defalut 태그 상위순 and 타이틀  
     *  filterOpt : 'tag 1만 보이도록?'
     * }
     */
    $.ajax({
        type: "GET",
        url: "./api/memoList",
        data: {
            pageNo: currentPage,
            sortOpt: sortOption,
            filterOpt: filterOption
        },
        dataType: "JSON",
        success: function (json) {
            // console.log(json);
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
            // console.log("PageNum\t" + nowPage);
            // console.log("hasMore\t" + hasMore)
        },
        error: function (xhr, status, error) {
            alert(error);
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
    contents = contents.replace(/<br>/gi,'\n');
    const etc = divRoot.find('#card-etc').text().split(',');
    const memoId = Number(etc[0]);
    const tagColor = Number(etc[1]);

    const divDetailRoot = $('#detail_root');

    bindHeaderTag(tagColor);
    divDetailRoot.find('#detail-title').val(title);
    divDetailRoot.find('#title-counter').text(title.length + '/40');
    divDetailRoot.find('#detail-contents').val(contents);
    divDetailRoot.find('#contents-counter').text(contents.length + '/400');
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

    console.log("내용 " + contents);

    $.ajax({
        type: 'PUT',
        url: './api/updateMemo',
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

// 갱신 처리..
function refresh() {
    currentPage = 1;
    sortOption = '';
    filterOption = '';
    hasMore = false;
    window.location.reload();
}

let preScrollTop = 0;
let floatingMaxHeight;
let floatingBtn;
let isScrollDown = false;
let floatingTransY = 0;

// 스크롤 이벤트
window.onscroll = function (ev) {

    if(floatingBtn == null){
        floatingBtn = $('#floating_btn');
        floatingMaxHeight = floatingBtn.outerHeight(true) + 10;
    }

    let scrollOffset;

    const scrollY = window.scrollY;

    if(scrollY > preScrollTop){
        console.log("Scroll Down");
        scrollOffset = preScrollTop - scrollY;
        isScrollDown = true;
        floatingTransY -= scrollOffset;

    } else {
        console.log("Scroll Up");
        scrollOffset = scrollY - preScrollTop;
        isScrollDown = false;
        floatingTransY += scrollOffset;
    }

    if(floatingTransY > floatingMaxHeight){
        floatingTransY = floatingMaxHeight;
    } else if(floatingTransY < 0){
        floatingTransY = 0;
    }

    floatingBtn.css('transform','translateY('+ floatingTransY+'px)');

    console.log("TEST:: " + floatingTransY);
    
    preScrollTop = scrollY;
    
    // 페이징 처리
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // 데이터를 더 호출할수 있다면 추가 로딩
        if (hasMore) {
            currentPage++;
            console.log("Add Loading Current Page " + currentPage);
            getMemoList();
        }
    }
};

// 부모 스크롤 방지
function scrollDisable(){
    $('html, body').addClass('scroll-stop');
}

// 부모 스크롤 작동
function scrollAble(){
    $('html, body').removeClass('scroll-stop');
}

/*
var scrollTop = $win.scrollTop(),
            maxScrollTop = $doc.outerHeight() - $win.height() - 100;
            
bottomBarTop = bottomBarTop - (preScrollTop - scrollTop);
	
				if (bottomBarTop < 0){
					bottomBarTop = 0;
				} else if (bottomBarTop > bottomBarH + bottomBarTopAddiHeight) {
					bottomBarTop = bottomBarH + bottomBarTopAddiHeight;
				}
	
				bottomFixedUITop = bottomBarTop - bottomBarH;
	
				if (bottomFixedUITop > 0){
					bottomFixedUITop = 0;
				}

				console.log("TEST " + bottomBarTop);
	
				$bottomBar.stop().prop('translateY', bottomBarTop).css({
					'-webkit-transform' : 'translateY('+bottomBarTop+'px) translateZ(0)',
					'transform' : 'translateY('+bottomBarTop+'px) translateZ(0)'
                });
                */