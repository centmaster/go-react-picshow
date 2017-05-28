var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var join = require('path').join;


var fileNames=[];


function findSync(startPath) {
    var result=[];
    function finder(path) {
        var files=fs.readdirSync(path);
        files.forEach((val,index) => {
            var fPath=join(path,val);
            var stats=fs.statSync(fPath);
            if(stats.isDirectory()) finder(fPath);
            if(stats.isFile()&&fPath.indexOf('jpg')>0) result.push(fPath);
        });

    }
    finder(startPath);
    return result;
}
//var fileNames=findSync('./static/');
//console.log(fileNames);

// viewed at http://localhost:8080

// app.use(function(req, res,next) {
//     console.log('Time:', Date.now());
//     next();
// })


app.get('/',function (req, res, next) {
    fileNames=findSync('./static/');
    //精髓了，要不filename是乱码
    var arr=JSON.stringify(fileNames);
    res.setHeader("Set-Cookie", arr);
    next();
},function (req, res) {
    res.sendFile(path.join(__dirname + '/view/show.html'));
});

app.post('/api', function (req,res) {
    if(!isNaN(req.query.delete)){
        var item=req.query.delete;
        fs.unlink('./'+fileNames[item],function (err) {
            if(err) {
                console.log(err);
            }else{
                console.log('success');
            }
        })
    }
});

app.use('/static/',express.static(path.join(__dirname, './static')));
app.use('/css/',express.static(path.join(__dirname,'./css')));

app.listen(8080);




