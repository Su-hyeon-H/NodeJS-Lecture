//글쓰기 화면 추가
var http=require('http');
var url = require('url');
var fs =require('fs');              //데이터를 파일로 부터 읽고 추가하기 위함.
var qs = require('querystring');    //글쓰기 입력 받기 위함.


// <a href=""> </a> --하이퍼링크로 
//비슷한 부분이 반복 된므로 함수로 만들어줌
function templateHtml(list, navBar,title, desc){
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>File Web5-CRUD</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1><a href="/">Web 프로그래밍 기술</a></h1> 
        <h3>${list}</h3>
        <hr>
        <h4>${navBar}</h4>
        <hr>
        <h2>${title}</h2>
        <p>${desc}</p>

    </body>
    </html>`;
}
function templateList(filelist){
        var list ='<ul>\n';
        for(let file of filelist){
            let item =file.substring(0,file.length-4)
            list +=`<li><a href="/?title=${item}">${item}</a></li>\n`;
         }
    list +='</ul>';
    return list;
}

var app = http.createServer(function(req, res){
   // console.log(req.url); //-> /favicon.ico가 찍히는 것을 볼수 있다.

    var _url =req.url;
    var pathname =url.parse(_url, true).pathname;
    var queryData =url.parse(_url, true).query;
    //console.log(pathname,queryData);
    
    if(pathname==='/')
    {   
        if(queryData.title === undefined) //localhost:3000 
        //title은 위에 변수값 <li><a href="/?title=HTML5">HTML5</a></li>       
        {  
            let navBar=`<a href="/">홈으로</a>&nbsp;&nbsp;
                        <a href="/create">글쓰기</a>`; 
            let title="Welcome to WEB World";
            let desc=`웹(World Wide Web)의 개방성은 웹사이트나 온라인 애플리케이션을 제작하려는 사람들에게 많은 기회를 
                        제공합니다. 하지만 그 사용 방법을 알아야 웹 기술을 잘 활용할 수 있습니다. 아래의 링크들을 확인하여 
                         다양한 웹 기술을 배워보세요.`;
            
            //data에 있는 파일명을 불러내기 -list 
            fs.readdir('./data', function(err, files) {
            let list=templateList(files);
            let html=templateHtml(list,navBar,title,desc);
            res.writeHead(200);
            res.end(html);
        });
        }
        else            // localhost:3000/?title=xxx
        {
            let title=queryData.title; //유저가 선택한 title
            let navBar=`<a href="/">홈으로</a>&nbsp;&nbsp;
                        <a href="/update?title=${title}">수정하기</a>&nbsp;&nbsp; 
                        <a href="/delete?title=${title}">삭제하기</a>`;  
            //update,delete는 기존으 정보를 넣어줘야하기 때문에 create와 다르게 ?title=${title}가 추가되었다.
            let desc;
            
            fs.readdir('./data', function(err, files) {
                let list=templateList(files);

                //data에 있는 파일 내용을 불러내기 -desc
                fs.readFile(`./data/${title}.txt`, 'utf8',function(err, desc){
                    let html=templateHtml(list,navBar,title,desc);
                    res.writeHead(200);
                    res.end(html);
                });
                });
        }
    }

    //입력화면 생성
    else if (pathname === '/create')
    {
        fs.readdir('./data', function(err, files) {
            let list=templateList(files);
            let navBar=`<a href="/">홈으로</a>`;
            let html= `
            <!DOCTYPE html>
            <html>
            <head>
                <title>File Web-CR</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">Web 프로그래밍 기술</a></h1> 
                <h3>${list}</h3>
                <hr>
                <h4>${navBar}</h4>
                <hr>
                <h2>글 작성하기</h2>
                <form action="/create_proc" method="post">
                    <p><input type="text"size="40"name="title" placeholder="제목"></p>
                    <p><textarea name = "desc" rows="5" cols="60" placeholder="설명"></textarea></p>
                    <p><input type="submit" value="작성"></p>
                </form>
        
            </body>
            </html>`;
            res.writeHead(200);
            res.end(html);
        });

    }
    else if (pathname === '/create_proc')
    {
        var body='';
        //데이터가 오는 중
        req.on('data',function(data){ 
            body +=data;
        });
        //데이터가 끝나 end가 옴
        req.on('end',function(){
            let post =qs.parse(body);
            let title=post.title;   //title로 입력된 내용
            let desc=post.desc;     //내용으로 입려된 내용
            //파일로 저장하기
            fs.writeFile(`./data/${title}.txt`, desc, 'utf8', function(err){
                
                res.writeHead(302,{Location: `/?title=${title}`});  //저장 후 방금 저장된 title로 이동됨.
                res.end();
            });
        });
    }
    //글 수정하기 화면
    else if (pathname === '/update')
    {
        fs.readdir('./data', function(err, files) {
            let list=templateList(files);
            let navBar=`<a href="/">홈으로</a>`;
            let title=queryData.title; //유저가 선택한 title
            fs.readFile(`./data/${title}.txt`, 'utf8',function(err, desc){
                let html=`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>File Web-CRU</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">Web 프로그래밍 기술</a></h1> 
                    <h3>${list}</h3>
                    <hr>
                    <h4>${navBar}</h4>
                    <hr>
                    <h2>글 수정하기</h2>
                    <form action="/update_proc" method="post">
                        <input type="hidden" name="oldTitle" value="${title}">
                        <p><input type="text"size="40"name="title" value="${title}"></p>
                        <p><textarea name = "desc" rows="5" cols="60">${desc}</textarea></p>
                        <p><input type="submit" value="수정"></p>
                    </form>
            
                </body>
                </html>`;
                res.writeHead(200);
                res.end(html);
            });


        });
    }
    else if (pathname === '/update_proc')
    {
        var body='';
        //데이터가 오는 중
        req.on('data',function(data){ 
            body +=data;
        });
        //데이터가 끝나 end가 옴
        req.on('end',function(){
            let post =qs.parse(body);
            let oldTitle=post.oldTitle; //title수정을 위해 hidden title을 입력 받음.
            let title=post.title;   //title로 입력된 내용
            let desc=post.desc;     //내용으로 입려된 내용
            fs.rename(`./data/${oldTitle}.txt`,`./data/${title}.txt`,function(){
                fs.writeFile(`./data/${title}.txt`, desc, 'utf8', function(err){
                    res.writeHead(302,{Location: `/?title=${title}`});  //저장 후 방금 저장된 title로 이동됨.
                    res.end();
                });
            });
            
        });
    }
    else if (pathname === '/delete')
    {
        fs.readdir('./data', function(err, files) {
            let list=templateList(files);
            let navBar=`<a href="/">홈으로</a>`;
            let title=queryData.title; //유저가 선택한 title
            let html=`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>File Web-CRU</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">Web 프로그래밍 기술</a></h1> 
                    <h3>${list}</h3>
                    <hr>
                    <h4>${navBar}</h4>
                    <hr>
                    <h2>글 삭제하기</h2>
                    <form action="/delete_proc" method="post">
                        <input type="hidden" name="title" value="${title}">
                        <p>${title} 글을 삭제하시겠습니까?</p>
                        <p><input type="submit" value="확인"></p>
                    </form>
                </body>
                </html>`;
                res.writeHead(200);
                res.end(html);
        });
    }
    else if (pathname === '/delete_proc')
    {
        var body='';
        req.on('data',function(data){ 
        body +=data;
        });
        req.on('end',function(){
            let post =qs.parse(body);
            let title=post.title;   //title로 입력된 내용
            // title 삭제
            fs.unlink(`./data/${title}.txt`,function(err){
            res.writeHead(302,{Location: `/`});  //홈으로 이동
            res.end();  
            }); 
        });
    }
    else if (pathname === '/favicon.ico')
    {
        fs.readFile('nodejs.png', function(err, data) {
            res.statusCode=200;
            res.setHeader('Content-type','image/png');
            res.end(data);
        });
    }
    else
    {
        res.writeHead(404);
        res.end('Not found');
    }    
});
app.listen(3000);