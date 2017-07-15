
            function opentab(evt, tname) 
    {
                var i, tabcontent, tablinks;
                tabcontent = document.getElementsByClassName("tabcontent");
                cattab=document.getElementsByClassName("cattabcontent");
                
                for (i = 0; i < tabcontent.length; i++)
                    {
                        tabcontent[i].style.display = "none";
                    }
                cattab[0].style.display="none";
                
                tablinks = document.getElementsByClassName("tablinks");
                for (i = 0; i < tablinks.length; i++) 
                    {
                        tablinks[i].className = tablinks[i].className.replace(" active", "");
                    }

                document.getElementById(tname).style.display = "block";
                evt.currentTarget.className += " active";
                if (tname=="My bookshelf")
                    getbookshelf();
                else if (tname=="Book requests")
                    getrequest();
                else if (tname=="Books borrowed")
                    getborrowed();
                else if (tname=="Books lent")
                    getlent();
                else if(tname=="search")
                    document.getElementById("searchres").innerHTML='';
} 

      function openverttab(evt, category) {
        // Declare all variables
        var i, tabcontent, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("verttabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("verttablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the link that opened the tab
        document.getElementById(category).style.display = "block";
        evt.currentTarget.className += " active";
        getcategory(category);
    }
        
        var file;
        
        //retrieve cookie by name
  window.getCookie = function(name) {
  match = document.cookie.match(new RegExp(name + '=([^;]+)'));
  if (match) return match[1];
}
         
  var user_id=window.getCookie("user_id");
  var auth_token=window.getCookie("auth_token");
        
        //get user name and file
        $(document).ready(function()
        {
 
           
            
            var request= new XMLHttpRequest();
            var request2= new XMLHttpRequest();
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                //console.log(this.responseText);
                                var res = JSON.parse(this.responseText);  
                                document.getElementById("prof").innerHTML +=res.username; 
                                }
                              else 
                              { 
                                  console.log(this.responseText);
                              }
                         }               

                    }  
            request2.onreadystatechange=function(){
                          if(request2.readyState===XMLHttpRequest.DONE){

                             if(request2.status===200) 
                              { 
                                var res = JSON.parse(this.responseText);
                                file= res[0].file_id;
                                console.log(file);
                                if(file==null)
                                    
                                        document.getElementById("profimg").src='https://www.tm-town.com/assets/default_female600x600-3702af30bd630e7b0fa62af75cd2e67c.png';
                                        
                                    
                                 else   
                                        document.getElementById("profimg").src ='http://filestore.c100.hasura.me/v1/file/'+file;
                              }
                              else 
                              { 
                                  console.log(this.responseText);
                              }
                         }               

                    }  
            if(user_id!=undefined)
                {
                    request.open('POST'," http://auth.c100.hasura.me/user/account/info ", true);
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);  //get uname
                    request.withCredentials=true;
                    request.setRequestHeader('Content-type','application/json');
                    request.send(null);
                     
                    request2.open('POST'," http://data.c100.hasura.me/v1/query ", true);   //get file id
                    request2.withCredentials=true;
                    request2.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request2.setRequestHeader('Content-type','application/json');
                    request2.send(JSON.stringify({
    type:"select",
    args:{
        table:"User_info",
        columns:["file_id"],
        where:{"hasura_id":user_id}
}
}));
                }
        });
       
  //get category books 
        function getcategory(category)
        {
             var request= new XMLHttpRequest();
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                var content = '<div>';
                                console.log(this.responseText); 
                                var catbooks = JSON.parse(this.responseText);
                                for (var i=(catbooks.length)-1; i >=0; i--) {
                                var name= catbooks[i].name;
                                content += "<a style='cursor: pointer;'>"+catbooks[i].name+", "+catbooks[i].author+"</a><br>";
                            }
                                  content+="</div>";
                            document.getElementById(category).innerHTML = content;
                                
                                }
                              else 
                              { 
                                  console.log(this.responseText);
                              }
                         }               

                    }  
            var user_id=document.cookie;
            if(user_id!=undefined)
                {
                    request.open('POST'," http://data.c100.hasura.me/v1/query ", true);
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.withCredentials=true;
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({type:"select",args:{table:"Book", columns:["name","author"],  where:{"category":category}}}));
                    
                }
            

        }
        
       //GET BOOK SHELF     

         function getbookshelf()
        {
             var request= new XMLHttpRequest();
            
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                
                               if(JSON.parse(this.responseText).length!=0)
                                    {
                                var content = '<div>';
                                 bksh=JSON.parse(this.responseText);
                                for(var i=0;i<=(bksh.length-1);i++)
                                    {
                                        content += "<div id='shelf"+bksh[i].book_id+"'><a style='cursor: pointer;padding:3px;'>"+bksh[i].name+", "+bksh[i].author+"("+bksh[i].points_reqd+" pts)</a><button class='bluebut' onclick='removebook("+bksh[i].book_id+");'>Remove</button></div>";
                                    }
                                 content+="</div>";
                                 document.getElementById("My bookshelf").innerHTML = content;
        
                            } 
                                  else
                                      document.getElementById("My bookshelf").innerHTML='No books on your shelf';
                                    }
                              else 
                              { 
                                  console.log(this.responseText); 
                                
                              }
                            }
                                  
                                
                                
                              
                         }               

                    
           
            
            if(user_id!=undefined)
                {
                    
                    request.open('POST',"http://data.c100.hasura.me/v1/query ", true);
                    request.withCredentials=true;
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({type:"select",args:{table:"user_book_shelf", columns:["name","author","points_reqd","book_id"],  where:{"user_id":user_id}}}));
                    
                    
                }
        }


        
    //REMOVE BOOK FROM SHELF
    function removebook(id)
    {
        var request= new XMLHttpRequest();
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                
                                console.log(this.responseText); 
                                document.getElementById('shelf'+id).remove();
                            }
                                
                            
                                  
                                
                                
                              else 
                              { 
                                  console.log(this.responseText); 
                              }
                         }               

                    } 
            
            
            if(user_id!=undefined)
                {
                                                                                                 
                    request.open('POST',"http://data.c100.hasura.me/v1/query ", true);
                    request.withCredentials=true;
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({type:"delete",args:{table:"user_shelf", where:{"user_id":user_id,"book_id":id}}}));
                    
                    
                }
            

    }
        
          //GET BOOK REQUESTS    
         function getrequest()
        {
             var request= new XMLHttpRequest();
             
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                
                                console.log(this.responseText); 
                                if(JSON.parse(this.responseText).length!=0)
                                    {
                                var content = '<div>'; 
                                var books = JSON.parse(this.responseText);
                                for (var i=(books.length)-1; i >=0; i--) {
                                content += "<div id='"+books[i].request_id+"'><a style='cursor: pointer;margin-bottom:1px;'>"+books[i].name+", "+books[i].author+"&nbsp;requested by "+books[i].borrower_name+"</a><button class='bluebut' onclick='acceptreq("+books[i].request_id+","+books[i].book_id+","+books[i].points_reqd+");'>Accept</button><button class='bluebut' onclick='declinereq("+books[i].request_id+");'>Decline</button></div>";
                            }
                                 content+="</div>";
                                 document.getElementById("Book requests").innerHTML = content;
                                    }
                                   else
                                      {
                                          document.getElementById("Book requests").innerHTML='No book requests';
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
                    request.open('POST',"http://data.c100.hasura.me/v1/query ", true);
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.withCredentials=true;
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({type:"select",args:{table:"user_book_req", columns:["book_id","name","author","borrower_name","request_id","points_reqd"],  where:{"lender_id":user_id}}}));
                    
                    
                }
            

        }
        
    //ACCEPT REQUEST
        
        function acceptreq(req_id,book_id,points_reqd)
    {
        var request= new XMLHttpRequest();
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                
                                console.log(this.responseText);  
                                document.getElementById(req_id).remove();
                                removebook(book_id);
                                addpts(points_reqd);
                            }
                                
                            
                                  
                                
                                
                              else 
                              { 
                                  console.log(this.responseText); 
                              }
                         }               

                    } 
            
            
            if(user_id!=undefined)
                {
                                                                                                 
                    request.open('POST',"http://data.c100.hasura.me/v1/query ", true);
                    request.withCredentials=true;
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({type:"update",args:{table:"Book_request", $set:{"accepted":true},where:{"ID":req_id}}}));
                    
                    
                }
            

    }
   function addpts(pts)
{
    var points;
    var request=new XMLHttpRequest();
    
    var request1=new XMLHttpRequest();
        request1.onreadystatechange=function(){
                          if(request1.readyState===XMLHttpRequest.DONE){

                             if(request1.status===200) 
                              { 
                                
                                console.log(this.responseText);  
                                  var x=JSON.parse(this.responseText);
                                points=x[0].points+pts;
                                  console.log(points);
                                
                            }
                                
                            
                                  
                                
                                
                              else 
                              { 
                                  console.log(this.responseText); 
                              }
                         }               

                    } 
            
            
            if(user_id!=undefined)
                {
                                                                                                 
                    request1.open('POST',"http://data.c100.hasura.me/v1/query ", true);
                    request1.withCredentials=true;
                    request1.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request1.setRequestHeader('Content-type','application/json');
                    request1.send(JSON.stringify({type:"select",args:{table:"User_info", columns:["points"],where:{"hasura_id":user_id}}}));
                    
                    
                }
        request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                
                                console.log(this.responseText);  
                                
                               
                            }
                                
                            
                                  
                                
                                
                              else 
                              { 
                                  console.log(this.responseText); 
                              }
                         }               

                    } 
          if(user_id!=undefined)
                {
                                                                                                 
                    request.open('POST',"http://data.c100.hasura.me/v1/query ", true);
                    request.withCredentials=true;
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({type:"update",args:{table:"User_info", $set:{"points":pts},where:{"hasura_id":user_id}}}));
                    
                    
                }
            
}
   //DECLINE REQUEST
        
        function declinereq(id)
    {
        var request= new XMLHttpRequest();
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                
                                console.log(this.responseText);  
                                document.getElementById(id).remove();
                            }
                                
                            
                                  
                                
                                
                              else 
                              { 
                                  console.log(this.responseText); 
                              }
                         }               

                    } 
            
            
            if(user_id!=undefined)
                {
                                                                                                 
                    request.open('POST',"http://data.c100.hasura.me/v1/query ", true);
                    request.withCredentials=true;
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({type:"delete",args:{table:"Book_request",where:{"ID":id}}}));
                    
                    
                }
            

    }
        //GET BOOKS BORROWED    
         function getborrowed()
        {
             var request= new XMLHttpRequest();
             
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                 
                                if(JSON.parse(this.responseText).length!=0)
                                    {
                                
                                var content = '<div>'; 
                                var books = JSON.parse(this.responseText);
                                for (var i=(books.length)-1; i >=0; i--) {

                                content += "<div id='borr"+books[i].request_id+"'><a style='cursor: pointer;margin-bottom:3px;'>"+books[i].name+", "+books[i].author+"&nbsp;borrowed from "+books[i].lender_name+"</a><button class='bluebut' onclick='returnbook("+books[i].request_id+");'>Return</button></div>";
                                
                            }
                                 content+="</div>";
                                 document.getElementById("Books borrowed").innerHTML = content;
                                 
                            }
                                   else
                                      {
                                          document.getElementById("Books borrowed").innerHTML='You have not borrowed any books';
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
                    request.open('POST',"http://data.c100.hasura.me/v1/query ", true);
                    request.withCredentials=true;
                    request.setRequestHeader('Content-type','application/json');
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.send(JSON.stringify({type:"select",args:{table:"user_book_borrowed", columns:["name","author","lender_name","request_id"],  where:{"hasura_id":user_id}}}));
                    
                    
                }
            

        }

function returnbook(req_id)
{
    
    var request2= new XMLHttpRequest();
  
            request2.onreadystatechange=function(){
                          if(request2.readyState===XMLHttpRequest.DONE){

                             if(request2.status===200) 
                              { 
                                
                                console.log(this.responseText);
                                document.getElementById('borr'+req_id).remove();
                            }
                                
                            
                                  
                                
                                
                              else 
                              { 
                                  console.log(this.responseText); 
                              }
                         }               

                    } 
            
            
            if(user_id!=undefined)
                {
                                                                                                 
                   
                                                                                                 
                    request2.open('POST',"http://data.c100.hasura.me/v1/query ", true);
                    request2.withCredentials=true;
                    request2.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request2.setRequestHeader('Content-type','application/json');
                    request2.send(JSON.stringify({type:"delete",args:{table:"Book_request",where:{"ID":req_id}}}));
                    
                    
                }
    
}

        //GET BOOKS LENT   
         function getlent()
        {
             var request= new XMLHttpRequest();
             
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                if(JSON.parse(this.responseText).length!=0)
                                    {
                                        
                                console.log(this.responseText); 
                                var content = '<div>'; 
                                var books = JSON.parse(this.responseText);
                                for (var i=(books.length)-1; i >=0; i--) {
                                var name= books[i].name;
                                content += "<a style='cursor: pointer;'>"+books[i].name+", "+books[i].author+"&nbsp;borrowed by&nbsp;"+books[i].borrower_name+"</a><br>";
                            }
                                 content+="</div>";
                                 document.getElementById("Books lent").innerHTML = content;
                            }
                                  else
                                      {
                                          document.getElementById("Books lent").innerHTML='You have not lent any books';
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
                    request.open('POST',"http://data.c100.hasura.me/v1/query ", true);
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.withCredentials=true;
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({type:"select",args:{table:"user_book_lent", columns:["name","author","borrower_name"],  where:{"hasura_id":user_id}}}));
                    
                    
                }
            

        }

    //DROPDOWN
       
 $(document).click(function(){
  $("#myDropdown").hide();
});


$("#prof").click(function(e){
     $("#myDropdown").show();
  
  e.stopPropagation();
});


function search(param)
{
    document.getElementById("searchres").innerHTML='';
    newbook(param);                            
                                        
}

function newbook(param)
{
    content='<p style="text-decoration:underline">Books</p>';
     var request= new XMLHttpRequest();
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                
                                var deets=JSON.parse(this.responseText);
                                for(i=0;i<=deets.items.length-1;i++)
                               { 
                                var name=deets.items[i].volumeInfo.title;
                                var author=deets.items[i].volumeInfo.authors;
                                var isbnfull=deets.items[i].volumeInfo.industryIdentifiers;
                                var desc=deets.items[i].volumeInfo.description;
                                var rating=deets.items[i].volumeInfo.averageRating;
                                if((isbnfull==undefined)||(rating==undefined)||(desc==undefined))
                                    continue;
                                else
                                    var isbn=deets.items[i].volumeInfo.industryIdentifiers[0].identifier;
                                
                                var points;
                                if(rating==5)
                                    points=40;
                                else if(rating==4)
                                     points=30;
                                else if(rating==3)
                                    points=20;
                                else
                                    {
                                        points=10;
                                        rating=undefined;
                                        
                                    }
                                    
                                
                                renderbookresult(name,author);
                                    
                              }
                                  
                                  content+='<br><p style="text-decoration:underline">Users</p>';
                                  getusers(param);
                                  
                               }
                        
                            }
                             
                         }               

                     
            var user_id=document.cookie;
            if(user_id!=undefined)
                {
                    request.open('GET',"https://www.googleapis.com/books/v1/volumes?q="+param+"&maxResults=15&key=AIzaSyAGlzBxEtMmHQMYGeQNtML85CC1_sKb-JY", true);
                    request.send(null);
                    
                }
    
}

function getusers(param)
{
    console.log(content);
     var request= new XMLHttpRequest();
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                console.log(this.responseText);
                                if(this.responseText!='[]')
                                {
                                    
                                var deets=JSON.parse(this.responseText);
                                for(i=0;i<=deets.length-1;i++)
                                           { 
                                            var name=deets[i].name;
                                            var id=deets[i].hasura_id;
                                            console.log(name,id);
                                            renderuserresult(name);

                                          }
                                }
                                else
                                    {
                                        content+='No users to show';
                                    }
                                 finalresult();
                                  
                               }
                             }
                             
                         }               

            if(user_id!=undefined)
                {
                    request.open('POST',"http://data.c100.hasura.me/v1/query", true);
                    request.withCredentials=true;
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({
    type:"select",
    args:{
        table:"User_info",
        columns:["hasura_id","name"],
        where:{"name":param}
}
}));
                    
                }
    
}
var content;
function renderbookresult(name,author)
{
    console.log("called with "+name);
    content+="<a style='cursor: pointer;'>"+name+", "+author+"</a><br>";
}

function renderuserresult(name)
{
    console.log("called with "+name);
    content+="<a style='cursor: pointer;'>"+name+"</a><br>";
}
    
function finalresult()
{

console.log(content);
document.getElementById("searchres").innerHTML=content;
document.getElementById("searchres").style='padding-top:40px;'
content='';
}
     

// LOGOUT
      
        logout= function()
        {
            var request= new XMLHttpRequest();
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                window.location="/";
                                console.log(this.responseText);    
                              }
                              else 
                              { 
                                alert("Invalid");
                              }
                         }               

                    }    
            document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            request.open('POST'," http://auth.c100.hasura.me/user/logout ", true);
            request.setRequestHeader('Authorization','Bearer '+ auth_token);
            request.withCredentials=true;
            request.send(null);
        }
      
      
        
    