   function getParameterByName(name, url) 
        {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
        
        var other_user_id=getParameterByName("user_id");
        
    //GET USER INFO
 $(document).ready(function()
        {
 
            var request2=new XMLHttpRequest();
             
                    request2.onreadystatechange=function(){
                          if(request2.readyState===XMLHttpRequest.DONE){

                             if(request2.status===200) 
                              { 
                               var res=JSON.parse(this.responseText);
                                document.getElementById("name").innerHTML=res[0].name;
                                document.getElementById("city").innerHTML=res[0].city;
                                document.getElementById("points").innerHTML="Points:&nbsp;"+res[0].points;
                                getusershelf(res[0].name);
                               
                              }
                              else 
                              { 
                                console.log(this.responseText);
                              }
                         }               

                    }     
                    
            if(user_id!=undefined)
                {
                  
                    request2.open('POST', "http://data.bookwormbyrithi.hasura.me/v1/query", true);
                    request2.setRequestHeader('Content-type','application/json');
                    request2.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request2.withCredentials=true;
                    request2.send(JSON.stringify({type:"select",args:{
        table:"User_info",
        "columns":["city","points","name"],
        where:{"hasura_id":other_user_id}
    }
})); 
           
                   
                }
        });
    
         //GET USER SHELF
      function getusershelf(name)
         {
             var request2=new XMLHttpRequest();
             
                    request2.onreadystatechange=function(){
                          if(request2.readyState===XMLHttpRequest.DONE){

                             if(request2.status===200) 
                              { 
                               document.getElementById("usershelf").innerHTML='<h2 style="font-family:\'Sacramento\'">'+name+'\'s bookshelf:</h2>';
                               var res=JSON.parse(this.responseText);
                               
                               for(var i=0;i<res.length;i++)
                                   {
                                       document.getElementById("usershelf").innerHTML+="<a style='cursor: pointer;text-decoration:underline;padding:3px;' onclick='getbookpage("+res[i].isbn+")'>"+res[i].name+"</a>, "+res[i].author+"("+res[i].points_reqd+" pts)<button class='bluebut' onclick='sendrequest("+res[i].book_id+","+other_user_id+","+res[i].points_reqd+");'>Request</button><br>"
                                   }
                              }
                              else 
                              { 
                                console.log(this.responseText);
                              }
                         }               

                    }     
                    
            if(user_id!=undefined)
                {
                  
                    request2.open('POST', "http://data.bookwormbyrithi.hasura.me/v1/query", true);
                    request2.setRequestHeader('Content-type','application/json');
                    request2.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request2.withCredentials=true;
                    request2.send(JSON.stringify({type:"select",args:{
        table:"user_book_shelf",
        "columns":["book_id","author","points_reqd","name","isbn"],
        where:{"user_id":other_user_id}
    }
})); 
           
                   
                }
        
        
         }
            
  
        
        //GET PROFILE PIC
   $(document).ready(function()
  {  
        var request=new XMLHttpRequest();
        request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                var res = JSON.parse(this.responseText);
                                file= res[0].file_id;
                                if(file==null)
                                  document.getElementById("userimg").src='https://www.tm-town.com/assets/default_female600x600-3702af30bd630e7b0fa62af75cd2e67c.png';
                                else
                                    document.getElementById("userimg").src ='http://filestore.bookwormbyrithi.hasura.me/v1/file/'+file;
                              }
                              else 
                              { 
                                  console.log(this.responseText);
                              }
                         }               

                    }
        if(user_id!=undefined)
            {
                request.open('POST'," http://data.bookwormbyrithi.hasura.me/v1/query ", true);   //get file id
                    request.withCredentials=true;
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({
    type:"select",
    args:{
        table:"User_info",
        columns:["file_id"],
        where:{"hasura_id":other_user_id}
}
}));
                }
            });
   
   //UPDATE USER INFO
       updateinfo=function()
       {
           var request2=new XMLHttpRequest();
         request2.onreadystatechange=function(){
                    if(request2.readyState===XMLHttpRequest.DONE){

                                     if(request2.status===200) 
                                      { 
                                        alert("Profile updated");
                                        console.log(this.responseText);
                                        location.reload();
                                      }
                                      else 
                                      { 
                                        alert("Oops! Something went wrong");
                                        console.log(this.responseText);  
                                      }
                                 }               

                            }
        
         request2.open('POST', "http://data.bookwormbyrithi.hasura.me/v1/query", true);
                    request2.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request2.setRequestHeader('Content-type','application/json');
                    request2.withCredentials=true;
                    request2.send(JSON.stringify({
    "type" : "update",
    "args" : {
        "table" : "User_info",
        "$set": {"file_id": file_id},
        "where": {
            "hasura_id": user_id
        }
    }
}))
       }
      
   