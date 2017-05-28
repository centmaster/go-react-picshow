var express = require('express');
var app = express();
var path = require('path');

// viewed at http://localhost:8080

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/view/show.html'));
});
app.get('/api', function(req, res) {
   console.log('chen');
})
app.use('/static/',express.static(path.join(__dirname, './static')));
app.use('/css/',express.static(path.join(__dirname,'./css')));

app.listen(8080);