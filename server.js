var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var join = require('path').join;
var stream = require('stream');


var fileNames=[];

function findSync(x,startPath) {
    var result=[];
    function finder(path) {
        var files=fs.readdirSync(path);
        files.forEach(function(val,index){
            var fPath=join(path,val);
            var stats=fs.statSync(fPath);
            if(stats.isDirectory()) finder(fPath);
            if(stats.isFile()&&fPath.indexOf('jpg')>0 && fPath.indexOf('dirty')<0) result.push(fPath);
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
    //fileNames=findSync('a','./static/').concat(findSync('b','./static/'),findSync('c','./static/'))
    //fileNames=findSync('a','./static/');
    //console.log(fileNames);
    //res.setHeader("Set-Cookie",fileNames);
    next();
},function (req, res) {
    res.sendFile(path.join(__dirname + '/view/show.html'));
});

app.post('/api', function (req,res) {
    console.log(req.query);
    if(!isNaN(req.query.delete)){
        var item=req.query.delete;
        //console.log(fileNames);
        var num=fileNames[item].split('/');
        var destination=num[0]+'/dirty-'+num[1]+'/'+num[2];
        var filepos='./'+fileNames[item].slice(fileNames[item].indexOf('=')+1);
        fs.writeFileSync(destination, fs.readFileSync(filepos));
        fs.unlink('./'+fileNames[item].slice(fileNames[item].indexOf('=')+1),function (err) {
            if(err) {
                console.log(err);
            }else{
                console.log('success delete');
            }
        })
    }else if(!isNaN(req.query.check)){
        var item=req.query.check;
        //console.log(fileNames);
        var num=fileNames[item].split('/');
        var destination=num[0]+'/check-'+num[1]+'/'+num[2];
        var filepos='./'+fileNames[item].slice(fileNames[item].indexOf('=')+1);
        fs.writeFileSync(destination, fs.readFileSync(filepos));
        fs.unlink('./'+fileNames[item].slice(fileNames[item].indexOf('=')+1),function (err) {
            if(err) {
                console.log(err);
            }else{
                console.log('success check');
            }
        })
    }
});

app.get('/api/getpos',function (req, res) {
    fileNames=findSync('a','./static/');
   // console.log(fileNames);
    res.json(JSON.stringify(fileNames));
})

app.use('/static/',express.static(path.join(__dirname, './static')));
app.use('/css/',express.static(path.join(__dirname,'./css')));

app.listen(1037);




