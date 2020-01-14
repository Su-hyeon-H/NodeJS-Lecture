var http=require('http');
var url = require('url');           
var qs = require('querystring');

var express =require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var template = require('./view/template');

const apiKey='2b1585db81210e5fab4d5b45a0decb4c';
const apiURI='http://api.openweathermap.org/data/2.5/weather?q=Yongin,kr&units=metric&appid=';

var request = require('request');
var weatherURI=apiURI + apiKey;

var listSql = "SELECT id, title, userId, strftime('%Y-%m-%d %H:%M', timestamp, 'localtime') ts, content, hit FROM bbs";
var searchSql = "SELECT id, title, userId, strftime('%Y-%m-%d %H:%M', timestamp, 'localtime') ts, content, hit FROM bbs where id=?";
var incHitSql = `UPDATE bbs SET hit=(SELECT hit FROM bbs WHERE id=?)+1 WHERE id=?`;
var insertSql = `INSERT INTO bbs(title, userId, content) VALUES(?, ?, ?)`;
var updateSql = `UPDATE bbs SET title=?, userId=?, timestamp=datetime('now'), content=? WHERE id=?`;
var deleteSql = `DELETE FROMbbs WHERE id=?`;
var db = new sqlite3.Database("db/bbs.db");


const app =express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.get('/', function(req, res){
    request(weatherURI,function(error,response,data){
        if(error){
            throw error;
        }
        var result = JSON.parse(data);
        let navBar=template.navMain(result);
        let trs = '';
        db.all(listSql, function(err, rows) {
            for(let row of rows) {
                trs += template.tableMain(row);
            }
            let view = require('./view/index');
            let html = view.index(navBar, trs);
            res.send(html);
        });
    });
});
app.get('/id/:id', function(req, res){
    
        let idVal = parseInt(req.params.id);
        let navBar = template.navList(idVal);
        db.serialize(function() {
            var stmt = db.prepare(incHitSql);
            stmt.run(idVal, idVal);
            stmt.finalize();
        
            stmt = db.prepare(searchSql);
            stmt.get(idVal, function(err, row) {
                let trs = template.tableItem(row);
                let view = require('./view/itemView');
                let html = view.itemView(navBar, trs);
                res.send(html);
            });
            stmt.finalize();
        });
    
    });
    app.get('/create', function(req, res){
        let navBar = template.navOp();
        let view = require('./view/create');
        let html = view.create(navBar);
        res.send(html);
    });
    app.post('/create', function(req, res){
            let title = req.body.title;
            let userId = req.body.userId;
            let content = req.body.content;
            let stmt = db.prepare(insertSql);
            stmt.run(title, userId, content);
            stmt.finalize();
            res.redirect('/');
    });
    app.get('/update/:id', function(req, res){
        let idVal = parseInt(req.params.id);
        let navBar = template.navOp();
        let stmt = db.prepare(searchSql);
        stmt.get(idVal, function(err, row) {
            let view = require('./view/update');
            let html = view.update(navBar, row);
            res.send(html);
        });
        stmt.finalize();
    });
    app.post('/update', function(req, res){
        
        let idVal = parseInt(req.body.id);
        let title = req.body.title;
        let userId = req.body.userId;
        let content = req.body.content;

        let stmt = db.prepare(updateSql);
        stmt.run(title, userId, content, idVal);
        stmt.finalize();
        res.redirect(`/id/${idVal}`);
    });
    app.get('/delete/:id',function(req, res){
        let idVal = parseInt(req.params.id);
        let navBar = template.navOp();
        let stmt =db.prepare(searchSql);
        stmt.get(idVal, function(err, row) {
            let view = require('./view/delete');
            let html = view.delete(navBar, row);
            res.send(html); 
         });
        stmt.finalize();
    });
    app.post('/delete', function(req, res){
            let idVal = parseInt(req.body.id);
            let stmt = db.prepare(deleteSql);
            stmt.run(idVal);
            stmt.finalize();
            res.redirect('/');
});
    app.get('*',function(req, res){
        res.status(404).send('File not found');
    });
    app.listen(3000);





   /*  //console.log(_url);
   
    } else if (pathname === '/delete') {
        let title = queryData.title;
        fs.readdir('./data', function(err, files) {
            let list = template.List(files);
            let navBar = template.navOp();
            let view = require('./view/delete');
            let html = view.delete(list, navBar, title);
            res.writeHead(200);
            res.end(html);
        });
    } else if (pathname === '/delete_proc') {
        var body = '';
        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            let post = qs.parse(body);
            let title = post.title;
            fs.unlink(`./data/${title}.txt`, function(err) {
                res.writeHead(302, {Location: '/'});
                res.end();
            });
        });
    } else if (pathname === '/favicon.ico') {
        fs.readFile('nodejs.png', function(err, data) {
            res.statusCode = 200;
			res.setHeader('Content-type', 'image/png');		
			res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});
app.listen(3000); */