var http=require('http');
var url = require('url');
var fs =require('fs');              //데이터를 파일로 부터 읽고 추가하기 위함.
var qs = require('querystring');    //글쓰기 입력 받기 위함.
var sqlite3 = require('sqlite3').verbose();
var template=require('./view/template');

var listSql = "SELECT id, title, writer, strftime('%Y-%m-%d %H:%M', timestamp, 'localtime') ts, content, hit FROM bbs";
var searchSql = "SELECT id, title, writer, strftime('%Y-%m-%d %H:%M', timestamp, 'localtime') ts, content, hit FROM bbs where id=?";
var incHSql = `update bbs set hit = (select hit from bbs where id=?)+1 where id =?`; //hit수 증가하기 위해 선언
var insertSql =`INSERT INTO bbs(title, writer, content) VALUES(?, ?, ?)`
var db = new sqlite3.Database("db/bbs.db");

var app = http.createServer(function(req, res){
   // console.log(req.url); //-> /favicon.ico가 찍히는 것을 볼수 있다.

    var _url =req.url;
    var pathname =url.parse(_url, true).pathname;
    var queryData =url.parse(_url, true).query;
    //console.log(pathname,queryData);
    
    if(pathname==='/')
    {   
        if(queryData.id === undefined) //localhost:3000 
        //title은 위에 변수값 <li><a href="/?title=HTML5">HTML5</a></li>       
        {  
            let navBar=template.navMain(); 
            let trs='';
            db.all(listSql, function(err, rows){
                for(let row of rows){
                    trs += template.tableMain(row);
                }
                let html=template.Html(navBar,trs);
                res.writeHead(200);
                res.end(html);
            });
            
        }
        else            // localhost:3000/?id=101

        {
            console.log(queryData.id);
            let idVal=parseInt(queryData.id); //유저가 선택한 title
            let navBar=template.navList(idVal);  

            db.serialize(function() {
                var stmt = db.prepare(incHSql);
                stmt.run(idVal, idVal);
                stmt.finalize();
                
                stmt = db.prepare(searchSql);
                stmt.get(idVal,function(err, row){
                    let trs = template.tableItem(row);
                        
                    let view = require('./View/itemView');
                    let html=view.itemView(navBar,trs)
                    res.writeHead(200);
                    res.end(html);
                });
                stmt.finalize();
                
            });
            
        }
    }

    //입력화면 생성
    else if (pathname === '/create')
    {
        
            let navBar=template.navOp();
            let view=require('./view/create');
            let html= view.create(navBar);
            res.writeHead(200);
            res.end(html);
        

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
            let writer =post.writer;
            let content =post.content;
            var stmt = db.prepare(insertSql);
            stmt.run(title, writer, content);
            stmt.finalize();
            
                
                res.writeHead(302,{Location: `/`});  //저장 후 방금 저장된 title로 이동됨.
                res.end();
            
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