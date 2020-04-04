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
                const title = element.TITLE;
                const contents = element.CONTENTS;
                const tagColor = 'tag' + element.TAG;
                const memoId = element.MEMO_ID;

                /* Root View */
                const rootDiv = document.createElement('div');
                rootDiv.className = 'col s12 m6';

                /* Background View */
                const bgDiv = document.createElement('div');
                bgDiv.className = 'card blue-grey darken-1';
                bgDiv.setAttribute('onclick','showDetail(this)');

                /* Contents View */
                const contentsDiv = document.createElement('div');
                contentsDiv.className = 'card-content white-text ellipsis';

                /* etc Tag */
                const etcTagDiv = document.createElement('h');
                etcTagDiv.className = 'etc_tags';
                etcTagDiv.style = 'display: none;';
                etcTagDiv.innerText = memoId + ',' + element.TAG;

                /* Tag View */
                const tagDiv = document.createElement('div');
                tagDiv.className = 'card-action tag_color ' + tagColor;

                /* View Append */
                bgDiv.append(contentsDiv);
                bgDiv.append(etcTagDiv);
                bgDiv.append(tagDiv);
                rootDiv.append(bgDiv);

                /* bindView */
                contentsDiv.innerHTML =
                    '<span class="card-title">' + title + '</span>' +
                    '<p class="card-contents">' + contents + '</p>';

                document.getElementById('memo_list').appendChild(rootDiv);
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
    $('.dropdown-trigger').dropdown();

    // 메모 수정 이벤트
    $('.update_memo').on('click', function () {
        const divDetail = $('#detail_root');
        updateData(divDetail);
    })
});

/*
 * 메모 상세 팝업창 보기
 */
function showDetail(divContents) {
    divContents = $(divContents);
    const title = divContents.find('.card-title').text();
    const contents = divContents.find('.card-contents').html();
    const etc = divContents.find('.etc_tags').text().split(',');
    const memoId = Number(etc[0]);
    const tagColor = Number(etc[1]);

    console.log(title);
    console.log(contents);
    console.log(memoId);
    console.log(tagColor);

    const divDetailRoot = $('#detail_root');

    divDetailRoot.find('#tag').removeClass('tag1 tag2 tag3 tag4 tag5 tag6 tag7');
    divDetailRoot.find('#tag').addClass(tagColor);
    divDetailRoot.find('#title').text(title);
    divDetailRoot.find('#contents').html(contents);
    divDetailRoot.find('#etc_tags').text(memoId + ',' + tagColor);
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
 * @param tagId : 선택한 태그 id
 */
function selectedTag(color) {
    let tagNm;
    let tagColor;
    switch (color) {
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
    $('#selected_tag').css('background-color', tagColor);
}

/*
 * 메모 데이터 업데이트
 */
function updateData(divDetail) {

    const title = divDetail.find('#title').text();
    const contents = divDetail.find('#contents').html();
    const etc = divDetail.find('#etc_tags').text().split(',');
    const memoId = Number(etc[0]);
    const tag = etc[1];

    const obj = new Object();
    obj.title = title;
    obj.contents = contents;
    obj.memoId = memoId;
    obj.tag = tag;

    console.log('Title ' + title);
    $.ajax({
        type: 'PUT',
        url: '../api/updateMemo',
        contentType: 'application/json; charset=utf-8',
        dataType: 'JSON',
        data: title,
        success: function (json) {
            console.log('Success json');
        },
        error: function (xhr, status, error) {
            alert(error);
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