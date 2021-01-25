var element_layer = document.getElementById('layer');
      daum.postcode.load(function(){
          new daum.Postcode({
              oncomplete: function(data) {
                              if(data.userSelectedType=="R"){
                                  window.OneaOneJavaInterface.setAddress(data.zonecode, data.roadAddress, data.buildingName);
                              }
                              else{
                                  window.OneaOneJavaInterface.setAddress(data.zonecode, data.jibunAddress, data.buildingName);
                              }
              }
          }).embed(element_layer);
      });