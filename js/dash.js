console.log(document.cookie);
function opentab(evt, tname) 
    {
                var i, tabcontent, tablinks;
                tabcontent = document.getElementsByClassName("tabcontent");
                cattab=document.getElementsByClassName("cattabcontent");
                
                for (i = 0; i < tabcontent.length; i++)
                    tabcontent[i].style.display = "none";
                    
                cattab[0].style.display="none";
                tablinks = document.getElementsByClassName("tablinks");
                for (i = 0; i < tablinks.length; i++) 
                    
                        tablinks[i].className = tablinks[i].className.replace(" active", "");
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

    function openverttab(evt, category) 
    {
        
        var i, tabcontent, tablinks;

        tabcontent = document.getElementsByClassName("verttabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByClassName("verttablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        document.getElementById(category).style.display = "block";
        evt.currentTarget.className += " active";
        getcategory(category);
     }
        
    var file,userpoints;
        
    
   window.getCookie = function(name) 
   {
      match = document.cookie.match(new RegExp(name + '=([^;]+)'));
      if (match) return match[1];
   }
         
   var user_id=window.getCookie("user_id");
   var auth_token=window.getCookie("auth_token");
        
    //GET UNAME AND FILE_ID
    $(document).ready(function()
    {
            var request= new XMLHttpRequest();
            var request2= new XMLHttpRequest();
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                console.log(this.responseText);
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
                                userpoints= res[0].points;
                                file= res[0].file_id;
                                console.log(file);
                                if(file==null)
                                    
                                        document.getElementById("profimg").src='https://www.tm-town.com/assets/default_female600x600-3702af30bd630e7b0fa62af75cd2e67c.png';
                                        
                                    
                                 else   
                                        document.getElementById("profimg").src ='http://filestore.bookwormbyrithi.hasura.me/v1/file/'+file;
                              }
                              else 
                              { 
                                  console.log(this.responseText);
                              }
                         }               

                    }  
            if(user_id!=undefined)
                {
                    
                    request.open('POST'," http://auth.bookwormbyrithi.hasura.me/user/account/info ", true);
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);  //get uname
                    request.withCredentials=true;
                    request.setRequestHeader('Content-type','application/json');
                    request.send(null);
                     
                    request2.open('POST'," http://data.bookwormbyrithi.hasura.me/v1/query", true);   //get file id
                    request2.withCredentials=true;
                    request2.setRequestHeader('Authorization','Bearer '+auth_token);
                    request2.setRequestHeader('Content-type','application/json');
                    request2.send(JSON.stringify({
    type:"select",
    args:{
        table:"User_info",
        columns:["file_id","points"],
        where:{"hasura_id":user_id}
}
}));
                }
        });
       
    //GET CATEGORY BOOKS
    function getcategory(category)
    {
             var request= new XMLHttpRequest();
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                 if(JSON.parse(this.responseText).length!=0)
                                     {
                                var content = '';
                                console.log(this.responseText); 
                                var catbooks = JSON.parse(this.responseText);
                                for (var i=(catbooks.length)-1; i >=0; i--) {
                                var name= catbooks[i].name;
                                content += "<a class='booklink' onclick='getbookpage(\""+catbooks[i].isbn+"\")'>"+catbooks[i].name+", "+catbooks[i].author+"</a><br>";
                            }
                            document.getElementById(category).innerHTML = content;
                                
                                }
                                  else
                                      document.getElementById(category).innerHTML='Nothing in this category';
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
                    request.open('POST'," http://data.bookwormbyrithi.hasura.me/v1/query ", true);
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.withCredentials=true;
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({type:"select",args:{table:"Book", columns:["name","author","isbn","ID"],  where:{"category":category}}}));
                    
                }
            

        }
   

    //get user details page
    function getuserpage(user_id)
    {
        console.log('called with '+user_id);
        var request=new XMLHttpRequest();
        request.onreadystatechange=function(){
                              if(request.readyState===XMLHttpRequest.DONE){

                                 if(request.status===200) 
                                  { 

                                    window.location='/userdetails.html?user_id='+user_id;
                                  }
                                  else 
                                  { 
                                      console.log(this.responseText); 

                                  }
                                }




                             }               

                        request.open('GET','/userdetails.html?user_id='+user_id, true);
                        request.setRequestHeader('Content-type','application/json');
                        request.send(null);




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
                                    var content = '';
                                     bksh=JSON.parse(this.responseText);
                                    for(var i=0;i<=(bksh.length-1);i++)
                                        {
                                            content += "<div style='width:100%' class='booklink' id='shelf"+bksh[i].book_id+"'><a style='text-decoration:underline' onclick='getbookpage(\""+bksh[i].isbn+"\")'>"+bksh[i].name+"</a>, "+bksh[i].author+"("+bksh[i].points_reqd+" pts)<button class='bluebut' onclick='removebook("+bksh[i].book_id+");'>Remove</button></div><br>";
                                        }
                                     document.getElementById("My bookshelf").innerHTML = content;

                                } 
                                      else
                                          document.getElementById("My bookshelf").innerHTML='<div style="width:100%"class="booklink">No books on your shelf. Head to the <a class="blah" style="text-decoration:underline;cursor: pointer" onclick="opensearch(event, \'search\')">search</a> tab and add the books you have to your shelf</div>';     
                                        }
                                  else 
                                  { 
                                      console.log(this.responseText); 

                                  }
                                }




                             }               




                if(user_id!=undefined)
                    {

                        request.open('POST',"http://data.bookwormbyrithi.hasura.me/v1/query ", true);
                        request.withCredentials=true;
                        request.setRequestHeader('Authorization','Bearer '+ auth_token);
                        request.setRequestHeader('Content-type','application/json');
                        request.send(JSON.stringify({type:"select",args:{table:"user_book_shelf", columns:["name","author","points_reqd","book_id","isbn"],  where:{"user_id":user_id}}}));


                    }
            }
    function opensearch(evt,name)
    {
        opentab(evt,name);

    }

    //REMOVE BOOK FROM SHELF
    function removebook(id)
        {
            var request= new XMLHttpRequest();
                request.onreadystatechange=function(){
                              if(request.readyState===XMLHttpRequest.DONE){

                                 if(request.status===200) 
                                  {                                


                                        document.getElementById('shelf'+id).remove();

                                }





                                  else 
                                  { 
                                      console.log(this.responseText); 
                                  }
                             }               

                        } 

                        request.open('POST',"http://data.bookwormbyrithi.hasura.me/v1/query ", true);
                        request.withCredentials=true;
                        request.setRequestHeader('Authorization','Bearer '+ auth_token);
                        request.setRequestHeader('Content-type','application/json');
                        request.send(JSON.stringify({type:"delete",args:{table:"user_shelf", where:{"user_id":user_id,"book_id":id}}}));

        }
    //LEND BOOK
    function lendbook(id,points_reqd,borrower_id)
        {
            var request= new XMLHttpRequest();
                request.onreadystatechange=function(){
                              if(request.readyState===XMLHttpRequest.DONE){

                                 if(request.status===200) 
                                  {                                


                                        addpts(points_reqd,user_id);
                                        subpts(points_reqd,borrower_id);
                                        alert("Book lent!");

                                }





                                  else 
                                  { 
                                      console.log(this.responseText); 
                                  }
                             }               

                        } 

                        request.open('POST',"http://data.bookwormbyrithi.hasura.me/v1/query ", true);
                        request.withCredentials=true;
                        request.setRequestHeader('Authorization','Bearer '+ auth_token);
                        request.setRequestHeader('Content-type','application/json');
                        request.send(JSON.stringify({type:"update",args:{table:"user_shelf", $set:{"returned":false},where:{"user_id":user_id,"book_id":id}}}));

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
                                var content = ''; 
                                var books = JSON.parse(this.responseText);
                                for (var i=(books.length)-1; i >=0; i--) {
                                content += "<div style='width:100%' class='booklink' id='"+books[i].request_id+"'><a style='text-decoration:underline' onclick='getbookpage(\""+books[i].isbn+"\")'>"+books[i].name+"</a>, "+books[i].author+"&nbsp;requested by <a style='text-decoration:underline;'onclick='getuserpage("+books[i].borrower_id+")'>"+books[i].borrower_name+"</a><button class='bluebut' onclick='acceptreq("+books[i].request_id+","+books[i].book_id+","+books[i].points_reqd+","+books[i].borrower_id+");'>Accept</button><button class='bluebut' onclick='declinereq("+books[i].request_id+");'>Decline</button></div><br>";
                            }
                                 
                                 document.getElementById("Book requests").innerHTML = content;
                                    }
                                   else
                                      {
                                          document.getElementById("Book requests").innerHTML='<div style="width:100%"class="booklink">No book requests</div>';
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
                    request.open('POST',"http://data.bookwormbyrithi.hasura.me/v1/query ", true);
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.withCredentials=true;
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({type:"select",args:{table:"user_book_req", columns:["book_id","name","author","isbn","borrower_name","request_id","points_reqd","borrower_id"],  where:{"lender_id":user_id}}}));
                    
                    
                }
            

        }
        
    //ACCEPT REQUEST
    function acceptreq(req_id,book_id,points_reqd,borrower_id)
    {
        var request= new XMLHttpRequest();
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                
                                console.log(this.responseText);  
                                document.getElementById(req_id).remove();
                                lendbook(book_id,points_reqd,borrower_id);
                            }
                     
                                
                              else 
                              { 
                                  console.log(this.responseText); 
                              }
                         }               

                    } 
            
            
            if(user_id!=undefined)
                {
                                                                                                 
                    request.open('POST',"http://data.bookwormbyrithi.hasura.me/v1/query ", true);
                    request.withCredentials=true;
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({type:"update",args:{table:"Book_request", $set:{"accepted":true},where:{"ID":req_id}}}));
                    
                    
                }
            

    }

  
    
    function addpts(pts,id)
    {
         var points;
         var request1=new XMLHttpRequest();
            request1.onreadystatechange=function(){
                              if(request1.readyState===XMLHttpRequest.DONE){

                                 if(request1.status===200) 
                                  { 

                                     
                                    var x=JSON.parse(this.responseText);
                                    points=pts+x[0].points;
                                    console.log(user_id,points);
                                    updatepoints(points,id);  

                                }





                                  else 
                                  { 
                                      console.log(this.responseText); 
                                  }
                             }               

                        } 


                        request1.open('POST',"http://data.bookwormbyrithi.hasura.me/v1/query ", true);
                        request1.withCredentials=true;
                        request1.setRequestHeader('Authorization','Bearer '+ auth_token);
                        request1.setRequestHeader('Content-type','application/json');
                        request1.send(JSON.stringify({type:"select",args:{table:"User_info", columns:["points"],where:{"hasura_id":id}}}));

 
            
    }

    function subpts(pts,borrower_id)
    {
       var points;
         var request1=new XMLHttpRequest();
            request1.onreadystatechange=function(){
                              if(request1.readyState===XMLHttpRequest.DONE){

                                 if(request1.status===200) 
                                  { 

                                     
                                    var x=JSON.parse(this.responseText);
                                    points=x[0].points-pts;
                                    console.log(points,borrower_id);
                                
                                        updatepoints(points,borrower_id);
                                }





                                  else 
                                  { 
                                      console.log(this.responseText); 
                                  }
                             }               

                        } 


                        request1.open('POST',"http://data.bookwormbyrithi.hasura.me/v1/query ", true);
                        request1.withCredentials=true;
                        request1.setRequestHeader('Authorization','Bearer '+ auth_token);
                        request1.setRequestHeader('Content-type','application/json');
                        request1.send(JSON.stringify({type:"select",args:{table:"User_info", columns:["points"],where:{"hasura_id":borrower_id}}}));

    
    
            
    }

    function updatepoints(points,id)
    {
           var request=new XMLHttpRequest();
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

                        request.open('POST',"http://data.bookwormbyrithi.hasura.me/v1/query ", true);
                        request.withCredentials=true;
                        request.setRequestHeader('Authorization','Bearer '+ auth_token);
                        request.setRequestHeader('Content-type','application/json');
                        request.send(JSON.stringify({type:"update",args:{table:"User_info", $set:{"points":points},where:{"hasura_id":id}}}));


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
                                                                                                 
                    request.open('POST',"http://data.bookwormbyrithi.hasura.me/v1/query ", true);
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
                                
                                var content = ''; 
                                var books = JSON.parse(this.responseText);
                                for (var i=(books.length)-1; i >=0; i--) {

                                content += "<div style='width:100%' class='booklink' id='borr"+books[i].request_id+"'><a style='text-decoration:underline' onclick='getbookpage(\""+books[i].isbn+"\")'>"+books[i].name+"</a>, "+books[i].author+"&nbsp;borrowed from <a style='text-decoration:underline;'onclick='getuserpage("+books[i].lender_id+")'>"+books[i].lender_name+"</a><button class='bluebut' onclick='returnbook("+books[i].request_id+","+books[i].book_id+","+books[i].lender_id+");'>Return</button></div><br>";
                                
                            }
                                 
                                 document.getElementById("Books borrowed").innerHTML = content;
                                 
                            }
                                   else
                                      {
                                          document.getElementById("Books borrowed").innerHTML='<div style="width:100%" class="booklink">You have not borrowed any books. Search for users you may know or borrow some from our top lenders:<br><a style="text-decoration:underline;" onclick="getuserpage(73)"><img style="width:30px;height:30px;border-radius:50%;margin-top:5px;margin-right:4px;" src="http://filestore.bookwormbyrithi.hasura.me/v1/file/j2GnH">Rithika</a><br><a style="text-decoration:underline;"onclick="getuserpage(80)"><img style="width:30px;height:30px;border-radius:50%;margin-top:5px;margin-right:4px;" src="http://filestore.bookwormbyrithi.hasura.me/v1/file/evAfj">Rachana</a></div>';
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
                    request.open('POST',"http://data.bookwormbyrithi.hasura.me/v1/query ", true);
                    request.withCredentials=true;
                    request.setRequestHeader('Content-type','application/json');
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.send(JSON.stringify({type:"select",args:{table:"user_book_borrowed", columns:["name","author","lender_name","isbn","book_id","lender_id","request_id"],  where:{"hasura_id":user_id}}}));
                    
                    
                }
            

        }

    function returnbook(req_id,book_id,lender_id)
    {

        var request2= new XMLHttpRequest();

                request2.onreadystatechange=function(){
                              if(request2.readyState===XMLHttpRequest.DONE){

                                 if(request2.status===200) 
                                  { 

                                    console.log(this.responseText);
                                    document.getElementById('borr'+req_id).remove();
                                      returntoshelf(book_id,lender_id);
                                }





                                  else 
                                  { 
                                      console.log(this.responseText); 
                                  }
                             }               

                        } 


                if(user_id!=undefined)
                    {



                        request2.open('POST',"http://data.bookwormbyrithi.hasura.me/v1/query ", true);
                        request2.withCredentials=true;
                        request2.setRequestHeader('Authorization','Bearer '+ auth_token);
                        request2.setRequestHeader('Content-type','application/json');
                        request2.send(JSON.stringify({type:"delete",args:{table:"Book_request",where:{"ID":req_id}}}));


                    }

}

     function returntoshelf(id,lender_id)
    {
        var request= new XMLHttpRequest();
                request.onreadystatechange=function(){
                              if(request.readyState===XMLHttpRequest.DONE){

                                 if(request.status===200) 
                                  { 

                                    console.log(this.responseText); 
                                   alert("Returned successfully!");
                                }





                                  else 
                                  { 
                                      console.log(this.responseText); 
                                  }
                             }               

                        } 


                if(user_id!=undefined)
                    {

                        request.open('POST',"http://data.bookwormbyrithi.hasura.me/v1/query ", true);
                        request.withCredentials=true;
                        request.setRequestHeader('Authorization','Bearer '+ auth_token);
                        request.setRequestHeader('Content-type','application/json');
                        request.send(JSON.stringify({type:"update",args:{table:"user_shelf", $set:{"returned":true},where:{"book_id":id,"user_id":lender_id}}}));


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
                                var content = ''; 
                                var books = JSON.parse(this.responseText);
                                for (var i=(books.length)-1; i >=0; i--) {
                                var name= books[i].name;
                                content += "<div style='width:100%' class='booklink'><a style='text-decoration:underline' onclick='getbookpage("+books[i].isbn+")'>"+books[i].name+"</a>, "+books[i].author+"&nbsp;borrowed by&nbsp;<a style='text-decoration:underline;'onclick='getuserpage("+books[i].borrower_id+")'>"+books[i].borrower_name+"</a></div><br>";
                            }
                                 
                                 document.getElementById("Books lent").innerHTML = content;
                            }
                                  else
                                      {
                                          document.getElementById("Books lent").innerHTML='<div style="width:100%"class="booklink">You have not lent any books</div>';
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
                    request.open('POST',"http://data.bookwormbyrithi.hasura.me/v1/query ", true);
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.withCredentials=true;
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({type:"select",args:{table:"user_book_lent", columns:["name","author","borrower_name","isbn","borrower_id"],  where:{"hasura_id":user_id}}}));
                    
                    
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

    //SEARCH TAB
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
                                    console.log(this.responseText);

                                    var deets=JSON.parse(this.responseText);
                                    if(deets.items!=null)
                                        {
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
                                        var isbn=deets.items[i].volumeInfo.industryIdentifiers[0].identifier.toString();
                                       console.log(isbn);

                                   renderbookresult(name,author,isbn);

                                  }
                                        }
                                   

                                      content+='<br><p style="text-decoration:underline">Users</p>';
                                      getusers(param);

                                   }

                                }

                             }               


                var user_id=document.cookie;
                if(user_id!=undefined)
                    {
                        request.open('GET',"https://www.googleapis.com/books/v1/volumes?q=intitle:"+param+"&maxResults=15&orderBy=relevance&printType=books&key=AIzaSyAGlzBxEtMmHQMYGeQNtML85CC1_sKb-JY", true);
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
                                                var file_id=deets[i].file_id;
                                                console.log(name,id,file_id);
                                                renderuserresult(name,id,file_id);

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
                        request.open('POST',"http://data.bookwormbyrithi.hasura.me/v1/query", true);
                        request.withCredentials=true;
                        request.setRequestHeader('Authorization','Bearer '+ auth_token);
                        request.setRequestHeader('Content-type','application/json');
                        request.send(JSON.stringify({
        type:"select",
        args:{
            table:"User_info",
            columns:["hasura_id","name","file_id"],
            where:{"name":param}
    }
    }));

                    }
    }
    
    var content;  
    function renderbookresult(name,author,isbn)
    {
        content+="<a style='cursor: pointer;' onclick='getbookpage(\""+isbn+"\")'>"+name+", "+author+"</a><hr>";
    }

    //get book details page
    function getbookpage(isbn)
    {
        console.log('called with getbookpage '+isbn);
        var request=new XMLHttpRequest();
        request.onreadystatechange=function(){
                              if(request.readyState===XMLHttpRequest.DONE){

                                 if(request.status===200) 
                                  { 

                                    window.location='/bookdetails.html?isbn='+isbn;
                                  }
                                  else 
                                  { 
                                      console.log(this.responseText); 

                                  }
                                }




                             }               

                        request.open('GET',"/bookdetails.html?isbn="+isbn, true);
                        request.setRequestHeader('Content-type','application/json');
                        request.send(null);




    }


    function renderuserresult(name,user_id,file_id)
    {
        console.log("called with "+name);
        content+="<img class ='searchimg' src='http://filestore.bookwormbyrithi.hasura.me/v1/file/"+file_id+"'/> <a style='cursor: pointer;' onclick='getuserpage("+user_id+")'>"+name+"</a><hr>";
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
                                console.log(document.cookie);
                              }
                              else 
                              { 
                                alert("Invalid");
                              }
                         }               

                    }    
            document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            request.open('POST'," http://auth.bookwormbyrithi.hasura.me/user/logout ", true);
            request.setRequestHeader('Authorization','Bearer '+ auth_token);
            request.withCredentials=true;
            request.send(null);
        }
       

  // send request
function sendrequest(id,lender_id,pts)
    {
        console.log(userpoints,pts);
        userpoints=userpoints-pts;
        console.log(userpoints);
        if(userpoints<0)
                alert("Insufficient points!"); 
        else
            {
                 var request= new XMLHttpRequest();
             
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                
                                     
                                console.log(this.responseText); 
                                alert("Request sent!");
                                
                            }
                                 
                                  
                                
                                
                              else 
                              { 
                                  console.log(this.responseText); 
                                
                              }
                         }               

                    } 
            
            if(user_id!=undefined)
                {
                    request.open('POST',"http://data.bookwormbyrithi.hasura.me/v1/query ", true);
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.withCredentials=true;
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({type:"insert",
                                                 args:{table:"Book_request",
                                                       objects:[{"borrower_id":user_id,"lender_id":lender_id,"book_id":id,accepted:false}]}}));
                    
                    
                }
            

            }
           
            
        }
       
     
     
        
   