var element_layer = document.getElementById('layer');
      daum.postcode.load(function(){
          new daum.Postcode({
              oncomplete: function(data) {
                 alert("되는게맞나 ?")
                              if(data.userSelectedType=="R"){
                                  // userSelectedType : 검색 결과에서 사용자가 선택한 주소의 타입
                                  // return type : R - roadAddress, J : jibunAddress
                                  // TestApp 은 안드로이드에서 등록한 이름
                                  alert("되었나?1")
                                  window.TestApp.setAddress(data.zonecode, data.roadAddress, data.buildingName);
                              }
                              else{
                                  alert("되었나?2")
                                  window.TestApp.setAddress(data.zonecode, data.jibunAddress, data.buildingName);

                              }
              }
          }).embed();
      });