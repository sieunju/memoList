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
    // 메모 클릭시 이벤트 처리
    // $('.memo_contents').on('click', function () {
    //     let divContents = $(this);
    //     console.log("클릭!");
    //     showDetail(divContents);
    // });

    // 메모 상세 보기 태그 선택창 init.
    // $('.dropdown-trigger').dropdown();

    // 메모 수정 이벤트
    $('#update_memo').on('click', function () {
        const divDetail = $('#detail_root');
        updateData(divDetail);
    })

    // 메모 상세 내용 글자수 제한
    $(function(){
        $('#detail-title').keyup(function (e){
            let content = $(this).val();
            if(content.length <= 40){
                console.log('제목 ' + content.length);
                $('#title-counter').text(content.length + '/40');
            }
        });
        $('#detail-title').keyup();

        $('#detail-contents').keyup(function (e){
            let content = $(this).val();
            if(content.length <= 400){
                console.log('내용 ' + content.length);
                $('#contents-counter').text(content.length + '/400');
            }
        });
        $('#detail-contents').keyup();
        
    })
});

/*
 * 메모 상세 팝업창 보기
 */
function showDetail(divContents) {
    divContents = $(divContents);

    const title = divContents.find('#card-title').text();
    const contents = divContents.find('#card-contents').html();
    const etc = divContents.find('#card-etc').text().split(',');
    const memoId = Number(etc[0]);
    const tagColor = Number(etc[1]);

    console.log(title);
    console.log(contents);
    console.log(memoId);
    console.log(tagColor);

    const divDetailRoot = $('#detail_root');

    divDetailRoot.find('#tag').removeClass('tag1 tag2 tag3 tag4 tag5 tag6 tag7');
    divDetailRoot.find('#tag').addClass('tag' + tagColor);
    divDetailRoot.find('#detail-title').val(title);
    divDetailRoot.find('#title-counter').text(title.length + '/40');
    divDetailRoot.find('#detail-contents').val(contents);
    divDetailRoot.find('#contents-counter').text(contents.length + '/400');
    divDetailRoot.find('#etc_tags').text(memoId);
    selectedTag(tagColor);

    divDetailRoot.css("display", "inline");

}

/*
 * 메모 상세 팝업 숨기기
 */
function showDetailHidden() {
    console.log("Click!!");
    $('#detail_root').css("display", "none");
}

/*
 * 선택한 태그 노출 처리하는 함수
 * @param tagIndex : 선택한 태그
 */
function selectedTag(tagIndex) {
    let tagNm;
    let tagColor;
    switch (tagIndex) {
        case 1:
            tagNm = '빨강';
            tagColor = '#ff3b30';
            break;
        case 2:
            tagNm = '주황';
            tagColor = '#ff9500';
            break;
        case 3:
            tagNm = '노랑';
            tagColor = '#ffcc00';
            break;
        case 4:
            tagNm = '초록';
            tagColor = '#34c759';
            break;
        case 5:
            tagNm = '파랑';
            tagColor = '#007aff';
            break;
        case 6:
            tagNm = '보라';
            tagColor = '#af52de';
            break;
        default:
            tagNm = '기타';
            tagColor = '#8e8e93';
            break;
    }

    $('#selected_tag').text(tagNm);
    
}

/*
 * 메모 데이터 업데이트
 */
function updateData(divDetail) {

    const title = divDetail.find('#detail-title').val();
    const contents = divDetail.find('#detail-contents').val();
    const memoId = Number(divDetail.find('#etc_tags').text());
    let tagCd;

    switch ($('#selected_tag').text()) {
        case '빨강':
            tagCd = 1;
            break;
        case '주황':
            tagCd = 2;
            break;
        case '노랑':
            tagCd = 3;
            break;
        case '초록':
            tagCd = 4;
            break;
        case '파랑':
            tagCd = 5;
            break;
        case '보라':
            tagCd = 6;
            break;
        default:
            tagCd = 7;
            break;
    }

    console.log('Update Title ' + title);
    console.log('Update Contents ' + contents);
    console.log('Update Tag ' + tag);

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
        },
        error: function (xhr, status, error) {
            console.log('Update Error Code ' + status + '  ' + error);
        }
    });

}

// 스크롤 페이징 처리
window.onscroll = function (ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // 데이터를 더 호출할수 있다면 추가 로딩
        if (hasMore) {
            currentPage++;
            console.log("Add Loading Current Page " + currentPage);
            getMemoList();
        }
    }
};