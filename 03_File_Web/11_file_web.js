//a herf : 하이퍼링크

var http = require('http');
var url = require('url');
var fs = require('fs');


function templateHtml(list, title, desc){
    return `
<!DOCTYPE html>
<html>
<head>
    <title>File Web</title>
    <meta charset="utf-8">
</head>
<body>
    <h1><a href="/">WEB 프로그래밍 기술</a></h1>
    <h3><ul>
        <li><a href="/?title=HTML5">HTML5</a></li>
        <li><a href="/?title=CSS3">CSS3</a></li>
        <li><a href="/?title=Javascript">Javascript</a></li>
    </ul></h3>
    <hr>
    <h2>${title}</h2>
    <p>${desc}</p>
    </body>
    </html>`;
}
    var contents = [
        {title:"HTML5", desc:"HTML5 is ...."},
        {title:"CSS3", desc:"CSS3 is ...."},
        {title:"Javascript", desc:"Javascript is ...."},
    ]

var app = http.createServer(function(req, res){
    //console.log(req.url);
    var _url = req.url;
    var pathname = url.parse(_url, true).pathname;
    var queryData = url.parse(_url, true).query;
    //console.log(pathname);
    //console.log(queryData);

    if(pathname === '/'){
        if(queryData.title === undefined){//localhost:3000
        let title = "Welcome to WEB World";
        let desc = `웹(World Wide Web)의 개방성은 웹사이트나 온라인 애플리케이션을 제작하려는 사람들에게 많은 기회를 
        제공합니다. 하지만 그 사용 방법을 알아야 웹 기술을 잘 활용할 수 있습니다. 아래의 링크들을 확인하여 
        다양한 웹 기술을 배워보세요.`
        fs.readdir('./data', function(err, files){
            var list = '<ul>\n';
            for (let file of files) {
                let item = file.substring(0,file.length-4)
                list += `<ll><a href="/?title=${item}">${item}</a></li>\n`;
            }
            list += '</ul>';
            let html = templateHtml(list, title, desc);
            res.writeHead(200);
            res.end(html);
        });    
        }else{      //localhost:3000/?title=xxx
            let title = queryData.title;
            fs.readdir('./data', function(err, files){
                var list = '<ul>\n';
                for (let file of files) {
                    let item = file.substring(0,file.length-4)
                    list += `<ll><a href="/?title=${item}">${item}</a></li>\n`;
                }
                list += '</ul>';
                fs.readFile(`./data/${title}.txt`,'utf8', function(err,desc){
                let html = templateHtml(list, title, desc);
                res.writeHead(200);
                res.end(html);
            })
            });    
        }

    }else if (pathname === '/favicon.ico'){
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
