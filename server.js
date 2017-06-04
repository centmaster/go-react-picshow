var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var join = require('path').join;
var stream = require('stream');
var exec = require('child_process').exec;
var buf = new Buffer(1000000);

var fileNames=[];
var changeState=[];


    fs.watch('./static/2', function (event, filename) {
        console.log('event is: ' + event);
        if (filename) {
            console.log('filename provided: ' + filename);
            changeState.push('./static/2/'+filename);
        } else {
            console.log('filename not provided');
        }
    })


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

app.get('/state',function (req, res) {
    res.send(JSON.stringify(changeState));
    //state[fileNames[req.query.state]]
})

app.post('/api', function (req,res) {
    console.log(req.query);
    if(!isNaN(req.query.delete)){
        var item=req.query.delete;
        console.log(fileNames);
        var num=fileNames[item].split('/');
        var destination=num[0]+'/dirty-'+num[1]+'/'+num[2];
        var filepos='./'+fileNames[item].slice(fileNames[item].indexOf('=')+1);
        // fs.writeFileSync(destination, fs.readFileSync(filepos));
        // fs.unlink('./'+fileNames[item].slice(fileNames[item].indexOf('=')+1),function (err) {
        //     if(err) {
        //         console.log(err);
        //     }else{
        //         console.log('success delete');
        //     }
        // })
        //var arg1='/home/qincheng/transfer/xinjiang/xinjiang/query';
        var dest='/home/qincheng/transfer/xinjiang/xinjiang/query/picture-show/static/'+num[1]+'/';
        var n=req.query.clickcount;
        var clusterpos='./'+num[0]+'/'+num[1]+'/dirtycluster.list';
        var clusterrow=num[2].split('.')[0];
        var end = parseInt(clusterrow)+1;
        var clustersource;
        state[num[2]]=false;
        console.log('picture url:'+fileNames[item]);
        //console.log(clusterpos);
        // console.log("准备打开已存在的文件！");
        // fs.open(clusterpos, 'r+', function(err, fd) {
        //     if (err) {
        //         return console.error(err);
        //     }
        //     console.log("文件打开成功！");
        //     console.log("准备读取文件：");
        //     fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
        //         if (err){
        //             console.log(err);
        //         }
        //         console.log(bytes + "  字节被读取");
        //
        //         // 仅输出读取的字节
        //         if(bytes > 0){
        //             var index=buf.slice(0, bytes).toString().indexOf(clusterrow)+clusterrow.length+5;
        //             var endindex=buf.slice(0, bytes).toString().indexOf(end);
        //             console.log('beg:'+index+'end:'+endindex);
        //             console.log('!!!:'+buf.slice(0, bytes).toString().slice(index,endindex));
        //             clustersource=buf.slice(0, bytes).toString().slice(index,endindex)
        //         }
        //         fs.close(fd, function(err){
        //             if (err){
        //                 console.log(err);
        //             }
        //             console.log("文件关闭成功");
        //         });
        //     });
        // });
        exec('python /home/qincheng/test/checkdirtytools/ClusterAndMakeThumb.py'+' '+fileNames[item]+' '+n+' ',function(error,stdout,stderr){
            if(stdout.length >1){
                console.log('you offer args:',stdout);

            } else {
                console.log('you don\'t offer args');
            }
            if(error) {
                console.info('stderr : '+stderr);
            }
        });
        res.send('success');

    }else if(!isNaN(req.query.check)){
        var item=req.query.check;
        console.log(fileNames);
        var num=fileNames[item].split('/');
        var destination=num[0]+'/check-'+num[1]+'/'+num[2];
        var filepos='./'+fileNames[item].slice(fileNames[item].indexOf('=')+1);
        fs.writeFileSync(destination, fs.readFileSync(filepos));
        fs.unlink('./'+fileNames[item].slice(fileNames[item].indexOf('=')+1),function (err) {
            if(err) {
                console.log(err);
            }else{
                console.log('success check');
                res.end('success');
            }
        })
    }else if(!isNaN(req.query.merge)){
        var item = req.query.merge;
        var dest = fileNames[item];
        var num=fileNames[item].split('/');
        exec('python /home/qincheng/test/checkdirtytools/mergeClusters.py'+' '+fileNames[item]+' ',function(error,stdout,stderr){
            if(stdout.length >1){
                console.log('you offer args:',stdout);
                watch(num[1]);
            } else {
                console.log('you don\'t offer args');
            }
            if(error) {
                console.info('stderr : '+stderr);
            }
        });
        res.send('success');
    }else if(!isNaN(req.query.dirty)){
        var item=req.query.check;
        console.log(fileNames);
        var num=fileNames[item].split('/');
        var destination=num[0]+'/dirty-'+num[1]+'/'+num[2];
        var filepos='./'+fileNames[item].slice(fileNames[item].indexOf('=')+1);
        fs.writeFileSync(destination, fs.readFileSync(filepos));
        fs.unlink('./'+fileNames[item].slice(fileNames[item].indexOf('=')+1),function (err) {
            if(err) {
                console.log(err);
            }else{
                console.log('success check');
                res.end('success');
            }
        })
    }

});

app.get('/api/getpos',function (req, res) {
    fileNames=findSync('a','./static/');
    var arr=fileNames;
    for (var i=0;i<arr.length;i++){
        arr[i]=arr[i].replace('_','/');
        //console.log(Number(arr[i].split('/')[2]));
    }

    arr=arr.sort(function (a, b) {
        return Number(a.split('/')[2])-Number(b.split('/')[2]);
    })
    //console.log('arr:'+arr);
    for(var i=0;i<arr.length;i++){    //concat together
        var temp=arr[i].split("").reverse();
        temp[9]="_";
        arr[i]=temp.reverse().join("")
    }

    //console.log(arr);
    res.json(JSON.stringify(fileNames));
})

app.use('/static/',express.static(path.join(__dirname, './static')));
app.use('/css/',express.static(path.join(__dirname,'./css')));

app.listen(3000);




