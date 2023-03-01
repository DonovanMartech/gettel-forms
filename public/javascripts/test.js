 //JF.login(success, error) method takes two optional arguments
    //Both arguments should be function 
    //First argument will be called after successful login
    //Second argument will be called if authorization fails
    JF.login(

      function success(){
          JF.getForms(function(response){
              for(var i=0; i<response.length; i++){
                  document.write( "<li> " + response[i].title);
              }
          });
      },

      function error(){
          window.alert("Could not authorize user");
      }
  ); 