var express =require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var template = require('./view2/template');
var bcrypt = require ('bcrypt-nodejs');

var registerSql = `INSERT INTO user(id, name, password, tel) VALUES(?, ?, ?, ?)`;
var searchUserSql = "SELECT id, name, password, strftime('%Y-%m-%d', regDate, 'localtime') ts FROM user where id=?";

var listSql = "SELECT id, title, userId, strftime('%Y-%m-%d %H:%M', timestamp, 'localtime') ts, content, hit FROM bbs";
var incHitSql = `UPDATE bbs SET hit=(SELECT hit FROM bbs WHERE id=?)+1 WHERE id=?`;
var updateSql = `UPDATE bbs SET title=?, userId=?, timestamp=datetime('now'), content=? WHERE id=?`;
var deleteSql = `DELETE FROM bbs WHERE id=?`;
var db = new sqlite3.Database("db/bbs.db");

const app =express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.get('/', function(req, res){
    let navBar=template.navMain();
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
app.get('/id/:id', function(req, res){
    
        let idVal = parseInt(req.params.id);
        let navBar = template.navList(idVal);
        db.serialize(function() {
            var stmt = db.prepare(incHitSql);
            stmt.run(idVal, idVal);
            stmt.finalize();
        
            stmt = db.prepare(searchUserSql);
            stmt.get(idVal, function(err, row) {
                let trs = template.tableItem(row);
                let view = require('./view/itemView');
                let html = view.itemView(navBar, trs);
                res.send(html);
            });
            stmt.finalize();
        });
    
    });
    app.get('/register', function(req, res){
        let navBar = template.navOp();
        let view = require('./view2/register');
        let html = view.register(navBar);
        res.send(html);
    });
    app.post('/register', function(req, res){
            let id = req.body.title;
            let name = req.body.userId;
            let password = req.body.password;
            let password2 = req.body.password2;
            let tel = req.body.tel;

            let stmt =db.prepare(searchUserSql);
            stmt.get(id,function(err, row){
                if(row === undefined) {     //unique id
                    if (password != password2) {
                        console.log('비밀번호가 다릅니다.');
                        res.redirect('/register');
                    } else {
                        bcrypt.genSalt(10,function(err,salt){
                            if(err){
                                console.error('bcrypt.genSalt() 에러:', err);
                                return;
                            }else{
                                bcrypt.hash(password, salt, null, function(err, hash){
                            var stmt = db.prepare(registerSql);
                            stmt.run(id,name, hash,tel, email, function(){
                                console.log('사용자 등록 완료');
                            });
                            stmt.finalize();
                        });
                    }
                });
            }
                }else {
                    console.log('중복된 ID 입니다.');
                    res.redirect('/register');
                }
            });
            stmt.finalize();

            res.redirect('/register');
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