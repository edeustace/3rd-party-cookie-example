var fs = require('fs'),
  http = require('http'),
  express = require('express'),
  packageJson = require('./package.json');

var app = express();

var otherDomain = process.argv[2];
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.set('views', __dirname + '/consumer/views');
app.set('view engine', 'jade');

app.get('/', function(req,res,next){
  res.render('index', {iframeSrc: otherDomain});
});

app.get('/option-one', function(req,res,next){
  res.render('option-one', {
    otherDomainJs: otherDomain + '/option-one.js', 
    iframeSrc: otherDomain + '/option-one'});
});

app.get('/option-two', function(req,res,next){
  res.render('option-two', {
    otherDomainAsset: otherDomain + '/option-two.png', 
    iframeSrc: otherDomain + '/option-two'});
});

var port = process.env.PORT || 5000;

app.set('port', port);

http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + port);
});