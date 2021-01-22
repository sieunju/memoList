//var element_layer = document.getElementById('layer');
//      daum.postcode.load(function(){
//          new daum.Postcode({
//              oncomplete: function(data) {
//                 alert("되는게맞나 ?")
//                              if(data.userSelectedType=="R"){
//                                  // userSelectedType : 검색 결과에서 사용자가 선택한 주소의 타입
//                                  // r
//                                  "eturn type : R - roadAddress, J : jibunAddress
//                                  // TestApp 은 안드로이드에서 등록한 이름
//                                  alert("되었나?1");
//                                  window.OneaOneJavaInterface.setAddress(data.zonecode, data.roadAddress, data.buildingName);
//                              }
//                              else{
//                                  alert("되었나?2");
//                                  window.OneaOneJavaInterface.setAddress(data.zonecode, data.jibunAddress, data.buildingName);
//                              }
//              }
//          }).embed(element_layer);
//      });
//
//
//
//
//
          // 우편번호 찾기 찾기 화면을 넣을 element
    var element_wrap = document.getElementById('wrap');
    element_wrap.style.display = 'block';

    var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
        new daum.Postcode({
            oncomplete: function(data) {
                // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                if(data.userSelectedType=="R"){
                      // userSelectedType : 검색 결과에서 사용자가 선택한 주소의 타입
                      // return type : R - roadAddress, J : jibunAddress
                      // TestApp 은 안드로이드에서 등록한 이름
                      alert("되었나?1");
                      window.OneaOneJavaInterface.setAddress(data.zonecode, data.roadAddress, data.buildingName);
                  }
                  else{
                      alert("되었나?2");
                      window.OneaOneJavaInterface.setAddress(data.zonecode, data.jibunAddress, data.buildingName);
                  }
                // iframe을 넣은 element를 안보이게 한다.
                // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
                element_wrap.style.display = 'none';

                // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
                document.body.scrollTop = currentScroll;
            },
            // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.

            onresize : function(size) {
                element_wrap.style.height = size.height+'px';
            },

            width : '100%',
            height : '100%'
        }).embed(element_wrap);