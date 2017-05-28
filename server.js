var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');

// viewed at http://localhost:8080

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/view/show.html'));
});
app.post('/api', function (req,res) {
    if(!isNaN(req.query.delete)){
        var item=req.query.delete;
        fs.unlink('./static/'+item+'.jpg',function (err) {
            if(err) {
                console.log('err');
            }else{
                console.log('success');
            }
            return
        })
    }
});
app.use('/static/',express.static(path.join(__dirname, './static')));
app.use('/css/',express.static(path.join(__dirname,'./css')));

app.listen(8080);

