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
        success: function(json) {
            // console.log(json);
            json.dataList.forEach(element => {
                const title = element.TITLE;
                const contents = element.CONTENTS;
                const tagColor = 'tag' + element.TAG;

                /* Root View */
                const rootDiv = document.createElement('div');
                rootDiv.className = 'col s12 m6';

                /* Background View */
                const bgDiv = document.createElement('div');
                bgDiv.className = 'card blue-grey darken-1';

                /* Contents View */
                const contentsDiv = document.createElement('div');
                contentsDiv.className = 'card-content white-text ellipsis';

                /* Tag View */
                const tagDiv = document.createElement('div');
                tagDiv.className = 'card-action tag_color ' + tagColor;

                /* View Append */
                bgDiv.append(contentsDiv);
                bgDiv.append(tagDiv);
                rootDiv.append(bgDiv);

                /* bindView */
                contentsDiv.innerHTML =
                    '<span class="card-title">' + title + '</span>' +
                    '<p>' + contents + '</p>';

                document.getElementById('memo_list').appendChild(rootDiv);
            });

            currentPage = json.pageNo;
            hasMore = json.hasMore;
            // console.log("PageNum\t" + nowPage);
            // console.log("hasMore\t" + hasMore)
        },
        error: function(xhr, status, error) {
            alert(error);
        }
    });
}

// 스크롤 페이징 처리
window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // 데이터를 더 호출할수 있다면 추가 로딩
        if (hasMore) {
            currentPage++;
            console.log("Add Loading Current Page " + currentPage);
            getMemoList();
        }
    }
};