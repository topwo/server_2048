/**
 * Created by maofaming on 15/4/30.
 */
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '234567',
    database : 'server_2048'
});

function addZero (d) {
    return (d > 9 ? '' : '0') + d;
}

function getNowDate () {
    var date = new Date();
    var y = date.getFullYear(),
        m = date.getMonth(),
        d = date.getDate(),
        h = date.getHours(),
        f = date.getMinutes(),
        s = date.getSeconds();
    return [addZero(y),addZero(m + 1),addZero(d)].join('-') + ' ' + [addZero(h),addZero(f),addZero(s)].join(':');
}

function query(callback) {
    connection.query('select * from score order by tryNum desc limit 10', function(err, rows, fields) {
        if (err) throw err;
        console.log('The query is: ', rows);
        callback && callback(rows);
    });
}

function escapeString (str) {
    return str.replace(/\'|\"|\s/g,'');
}

function queryByName(name, callback) {

    var queryString = 'select * from score where name="' + escapeString(name) + '"';
    console.log('query name string', queryString);
    connection.query(queryString,function(err, rows){
        if (err) throw  err;
        console.log(rows);
        callback && callback(rows);
    })
}

function emptyFun(){

};

//function update(name, tryNum, score) {
function update(data, callback) {
    var name = data.name || '';
    var tryNum = data.tryNum || 0;
    var score = data.score || 0;
    callback = callback || emptyFun;
    name = escapeString(name);
    tryNum = parseInt(tryNum);
    score = parseInt(score);
    console.log(name, tryNum, score);
    if(name && tryNum && score ){
        queryByName(name, function (rows) {
            console.log('query by name', rows)
            var updateString = '';
            if (rows && rows.length > 0) {
                var item = rows[0];
                console.log('queryName:',rows);
                updateString = 'update score set tryNum=' + tryNum;
                if(item.score < score) {
                    updateString += ',score=' + score;
                }
                updateString += ',date="' + getNowDate() + '"';
                updateString += ' where name = "' + name + '"';
            } else {
                updateString += 'insert into score (name, tryNum, score, date) values ('
                + '"' + name + '",'
                + tryNum + ','
                + score + ','
                + '"' + getNowDate() + '"'
                + ')'
            }
            console.log(updateString);
            connection.query(updateString, function(err, rows, fields) {
                if (err) throw err;
                console.log('The solution is: ', rows);
                callback(true, rows)
            });
        })
    }else{
        callback(false);
    }
}

//update({
//    name : 'maofm123',
//    tryNum : 111,
//    score : 222
//});
//
//query();

//queryByName('maofm123');

exports.db = {
    query : query,
    update : update
}
