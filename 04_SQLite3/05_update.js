//DB접속
var sqlite3 = require('sqlite3').verbose(); 
var db = new sqlite3.Database("../../03_Sqlite/test.db");

var sql = `UPDATE bbs SET timestamp=datetime('now') where id=?`;//현재시간으로 변경
var subSql=`UPDATE bbs SET writer = (select writer from bbs where id=?) where id =?`;

db.serialize(function() {
    var stmt = db.prepare(subSql);
    stmt.run(105, 102);
    stmt.finalize();

    var sql_ts = "SELECT id, title, writer,strftime('%Y-%m-%d-%H:%M',timestamp, 'localtime') ts, content FROM bbs"; 
    db.each(sql_ts, function(err, row) {
        console.log(row.id, row.title, row.writer, row.ts, row.content);
    });
});


//DB접속 해제
db.close();