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
        
        var isbn=getParameterByName("isbn");
        var category,pts,id,flag;
        
        //GET BOOK CATEGORY,PTS,ID
        var request= new XMLHttpRequest();
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                 if(JSON.parse(this.responseText).length!=0)
                                     {
                                        category=JSON.parse(this.responseText)[0].category;
                                        pts=JSON.parse(this.responseText)[0].points_reqd;
                                        id=JSON.parse(this.responseText)[0].ID;
                                      
                            
                                     }
                                  else
                                      {
                                          flag='notthere';
                                          
                                      }
                                 googbook(isbn,flag);
                                
                                }
                                  else
                                      document.getElementById(category).innerHTML='Nothing in this category';
                              }
                              else 
                              { 
                                  console.log(this.responseText);
                              }
                         }               

                      
            
            if(user_id!=undefined)
                {
                    request.open('POST'," http://data.c100.hasura.me/v1/query ", true);
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.withCredentials=true;
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({type:"select",args:{table:"Book", columns:["category","points_reqd","ID"],  where:{"isbn":isbn}}}));
                    
                }

       //GET BOOK DEETS
         function googbook(isbn,flag)
    {
        
         var request= new XMLHttpRequest();
                request.onreadystatechange=function(){
                              if(request.readyState===XMLHttpRequest.DONE){

                                 if(request.status===200) 
                                  { 
                                    console.log(this.responseText);
                                    var deets=JSON.parse(this.responseText);
                                    var name=deets.items[0].volumeInfo.title;
                                    var author=deets.items[0].volumeInfo.authors;
                                    var isbnfull=deets.items[0].volumeInfo.industryIdentifiers[0].identifier;
                                    var desc=deets.items[0].volumeInfo.description;
                                    var image=deets.items[0].volumeInfo.imageLinks.thumbnail;
                                    var rating=deets.items[0].volumeInfo.averageRating;
                                    if(flag=='notthere')
                                        {
                                            if((deets.items[0].volumeInfo.categories[0])!='Fiction'&(deets.items[0].volumeInfo.categories[0])!='Young Adult Fiction'&(deets.items[0].volumeInfo.categories[0])!='Juvenile Fiction')                                           category='Other';

                                            else
                                                category=deets.items[0].volumeInfo.categories[0];
                                            
                                           pts=Math.round((rating*10)+7.5);
                                            id=null;
                                        }
                                        
                                      getlenders(name,author,desc,rating,isbnfull,image,category,pts,id);

                                     

                                   }

                                }

                             }               


                
                if(user_id!=undefined)
                    {
                        request.open('GET',"https://www.googleapis.com/books/v1/volumes?q=:isbn"+isbn+"&maxResults=1&key=AIzaSyAGlzBxEtMmHQMYGeQNtML85CC1_sKb-JY", true);
                        request.send(null);

                    }

    
    }


         //GET LENDERS   
    function getlenders(name,author,desc,rating,isbnfull,image,category,pts,id)
    {
       
             var request= new XMLHttpRequest();
            
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                
                               if(JSON.parse(this.responseText).length!=0)
                                    {
                                
                                   console.log(this.responseText);
                                    var users=JSON.parse(this.responseText);
                                    renderbook(name,author,desc,rating,isbnfull,image,category,pts,id,users) ;   
                                
        
                                    }
                                  else
                                      renderbook(name,author,desc,rating,isbnfull,image,category,pts,id,null);
                                 
                                    }
                              else 
                              { 
                                  console.log(this.responseText); 
                                
                              }
                            }
                                  
                                
                                
                              
                         }               

                    
           
            
            if(user_id!=undefined)
                {
                    var useless;
                    if(id==null)
                        useless=999;
                    else
                        useless=id;
                    request.open('POST',"http://data.bookwormbyrithi.hasura.me/v1/query ", true);
                    request.withCredentials=true;
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({type:"select",args:{table:"user_book_shelf", columns:["uname","user_id","profpic"],  where:{"book_id":useless}}}));
                    
                    
                }
        }
   function setrating(rating)
        {
            document.getElementById('rating').style.width=((rating/5)*100+'%');
        }
      
        function renderbook(name,author,desc,rating,isbnfull,image,category,pts,id,users)
            {   
                
                document.getElementById("title").innerHTML=name;
                document.getElementById("author").innerHTML=author;
                document.getElementById("cover").src=image;
                setrating(rating);
                document.getElementById("desc").innerHTML=desc+'<br><br> Points required:'+pts+'<button class="bluebut" onclick="addbook(\''+name+'\',\''+author+'\',\''+category+'\','+pts+',\''+isbnfull+'\','+id+')">Add to shelf</button><br>Category:'+category+'<br>ISBN:'+isbnfull;
                if(users==null)
                     document.getElementById("lenders").innerHTML='No one lending this book currently';
                else
                {
                    document.getElementById("lenders").innerHTML='Choose a lender to borrow this book from:<br>';
                 for (var i=0;i<users.length;i++)
                     {
                     if((users[i].user_id)==user_id)  
                         continue;
                     document.getElementById("lenders").innerHTML+='<a style=\'cursor:pointer;text-decoration:underline\' onclick="getuserpage('+users[i].user_id+')"><img class="lenderpic" src="http://filestore.bookwormbyrithi.hasura.me/v1/file/'+users[i].profpic+'">'+users[i].uname+'</a><button class="reqbut" onclick="sendrequest('+id+','+users[i].user_id+','+pts+')">Send borrow request</button><br>'; 
                     }
                  
                }
                
            }

//enter book to db and to shelf
 function addbook(name,author,category,pts,isbnfull,id)
    {
        console.log(id,pts);
        if(id!=null)
            addshelf(id);
        else
            {
               var request= new XMLHttpRequest();
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                
                                var bid=JSON.parse(this.responseText).returning[0].ID; 
                                console.log(bid);
                                addshelf(bid);
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
                    request.send(JSON.stringify({type:"insert",args:{table:"Book", 
                                    objects:[{"name":name,"author":author,"category":category,"points_reqd":pts,"isbn":isbnfull}],returning:["ID"]}}));
                    
                    
               
 
            }
            
        
    }

 function addshelf(id)
    {
        var request= new XMLHttpRequest();
            request.onreadystatechange=function(){
                          if(request.readyState===XMLHttpRequest.DONE){

                             if(request.status===200) 
                              { 
                                
                                console.log(this.responseText);
                                alert('Added to shelf successfully!');
                            }
                                
                            
                                  
                                
                                
                              else 
                              { 
                                  err=JSON.parse(this.responseText); 
                                  var msg=err.error;
                                  if(msg=="Uniqueness violation. duplicate key value violates unique constraint \"user_shelf_pkey\"")
                                      alert("Already in your shelf!");
                              }
                         }               

                    } 
            
            
            if(user_id!=undefined)
                {
                                                                                                 
                    request.open('POST',"http://data.bookwormbyrithi.hasura.me/v1/query ", true);
                    request.withCredentials=true;
                    request.setRequestHeader('Authorization','Bearer '+ auth_token);
                    request.setRequestHeader('Content-type','application/json');
                    request.send(JSON.stringify({type:"insert",args:{table:"user_shelf", objects:[{"user_id":user_id,"book_id":id,"returned":true}]}}));
                    
                    
                }
            
    }
    
 
     