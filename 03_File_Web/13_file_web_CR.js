//a herf : 하이퍼링크

var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

function templateHtml(list, navBar, title, desc){
    return `
<!DOCTYPE html>
<html>
<head>
    <title>File Web_CR</title>
    <meta charset="utf-8">
</head>
<body>
    <h1><a href="/">WEB 프로그래밍 기술</a></h1>
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
    var list = '<ul>\n';
    for (let file of filelist) {
        let item = file.substring(0,file.length-4)
        list += `<li><a href="/?title=${item}">${item}</a></li>\n`;
    }
    list += '</ul>';
    return list;
}


var app = http.createServer(function(req, res){
    //console.log(req.url);
    var _url = req.url;
    var pathname = url.parse(_url, true).pathname;
    var queryData = url.parse(_url, true).query;
    //console.log(pathname);
    //console.log(queryData);

    if(pathname === '/'){
        if(queryData.title === undefined){//localhost:3000
            let navBar = `<a href="/">홈으로</a>&nbsp;&nbsp;
                            <a href="/create">글쓰기</a>`;
            let title = "Welcome to WEB World";
            let desc = `웹(World Wide Web)의 개방성은 웹사이트나 온라인 애플리케이션을 제작하려는 사람들에게 많은 기회를 
            제공합니다. 하지만 그 사용 방법을 알아야 웹 기술을 잘 활용할 수 있습니다. 아래의 링크들을 확인하여 
            다양한 웹 기술을 배워보세요.`
            
            fs.readdir('./data', function(err, files){
                let list = templateList(files);
                let html = templateHtml(list, navBar, title, desc);
                res.writeHead(200);
                res.end(html);
            });    
        }else{      //localhost:3000/?title=xxx
            let title = queryData.title;
            let navBar = `<a href="/">홈으로</a>&nbsp;&nbsp;
                            <a href="/update">수정하기</a>&nbsp;&nbsp;
                            <a href ="/delete">삭제하기</a>`;
            let desc;


            fs.readdir('./data', function(err, files){
                let list = templateList(files);
                fs.readFile(`./data/${title}.txt`,'utf8', function(err,desc){
                let html = templateHtml(list,navBar, title, desc);
                res.writeHead(200);
                res.end(html);
            })
            });    
        }
    }else if (pathname === '/create'){
        fs.readdir('./data', function(err, files){
            let list = templateList(files);
            let navBar = `<a href="/">홈으로</a>`;
            let html =  `
            <!DOCTYPE html>
            <html>
            <head>
                <title>File Web_CR</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB 프로그래밍 기술</a></h1>
               <h3>${list}</h3>
                <hr>
                <h4>${navBar}</h4>
                <hr>
                <h2>글 작성하기</h2>
                <form action = "/create_proc" method = "post">
                    <p><input type= "text" size="40" name="title" placeholder="제목"></p>
                    <p><textarea name = "desc" rows="5" cols="60" placeholder ="설명"></textarea></p>
                    <p><input type="submit" value = "작성"></p>
                </form>
                </body>
                </html>`;
            res.writeHead(200);
            res.end(html);
        });    

    }
    else if(pathname === '/create_proc'){
        var body ='';
        req.on('data',function(data){
            body += data;
        });
        req.on('end', function(){
            let post = qs.parse(body);
            let title = post.title;
            let desc = post.desc;
            fs.writeFile(`./data/${title}.txt`, desc, 'utf8',function(err){
                res.writeHead(302,{Location: `/?title=${title}`});
                res.end();
            });
        });
    }
    else if (pathname === '/favicon.ico'){
        fs.readFile('nodejs.png', function(err,data){
            res.statusCode = 200;
            res.setHeader('Content-type', 'image/png');
            res.end(data);
        });
    }else  {
        res.writeHead(404);
    res.end('Not found');
    }
});
app.listen(3000);
