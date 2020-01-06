var http = require('http');
var url = require('url');
var html =`
<!DOCTYPE html>
<html>
<head>
    <title>Static Web</title>
    <meta charset="utf-8">
</head>
<body>
    <h1>WEB 프로그래밍 기술</h1>
    <h3><ul>
        <li>HTML5</li>
        <li>CSS3</li>
        <li>Javascript</li>
    </ul></h3>
    <hr>
    <p> hello </p>
    </body>
    </html>`;

var app = http.createServer(function(req, res){
    //console.log(req.url);
    var _url = req.url;
    var pathname = url.parse(_url, true).pathname;
    var queryData = url.parse(_url, true).query;
    console.log(pathname);
    console.log(queryData);

    if(pathname === '/'){
        res.writeHead(200);
        res.end(html);

    }else if (pathname === '/favicon.ico'){

    }else  {
        res.writeHead(404);
    res.end('Not found');
        
    }
    

});
app.listen(3000);