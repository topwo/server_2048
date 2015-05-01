var express = require('express');
var router = express.Router();

var db = require('./database').db;

var url = require('url');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/query', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    db.query(function(list){
        var data = {
            err : 0,
            errMsg : '',
            data : {
                list : list
            }
        };
        var body = JSON.stringify(data);
        res.writeHead(200, {
            'Content-Length': body.length,
            'Content-Type': 'text/plain' });
        res.write(body);
        res.end();
    });
});


router.get('/update', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    var urlParams = url.parse(req.url, true);
    console.log(urlParams.query);
    db.update(urlParams.query,function(bool, list){
        var data = {
            err : !!bool ? 0 : 1,
            errMsg : '',
            data : ''
        };
        var body = JSON.stringify(data);
        res.writeHead(200, {
            'Content-Length': body.length,
            'Content-Type': 'text/plain' });
        res.write(body);
        res.end();
    })
});

module.exports = router;
