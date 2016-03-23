var fs = require('fs'),
  http = require('http'),
  express = require('express'),
  packageJson = require('./package.json');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
var cookieParser = require('cookie-parser');

app.use(cookieParser('hello there sir - secret')); //<-- "Secret" to actually be secret

function setAssetCookie(req, res, next){
  res.cookie('provider_cookie', 'hello there - asset', { expires: new Date(Date.now() + 900000), httpOnly: true });
  next();
}

app.use(setAssetCookie, express.static('provider/public'));
app.set('views', __dirname + '/provider/views');
app.set('view engine', 'jade');

app.get('/', function(req,res,next){
  res.cookie('provider_cookie', 'hello there', { expires: new Date(Date.now() + 900000), httpOnly: true });
  res.render('index');
});

app.get('/option-one', function(req, res, next){
  res.render('index');
});

app.get('/option-two', function(req, res, next){
  res.render('index');
});

app.get('/option-one.js', function(req, res, next){
  res.cookie('provider_cookie', 'hello there - option-one', { expires: new Date(Date.now() + 900000), httpOnly: true });
  res.send('console.log(\'option one\');');
});

var needsARedirect = function(ua){
  return isSafari(ua) || isIE(ua);
};

var isSafari = function(ua){
  return ua.indexOf("Safari/") != -1 && ua.indexOf("Chrome") == -1;
};

var isIE = function(ua){
  return ua.indexOf("MSIE") != -1;
};

app.get('/session-info', function(req,res,next){

  console.log(req.cookies);
  var cookie = req.cookies.provider_cookie;
  res.json( { cookie: cookie });
});

var port = process.env.PORT || 5001;
app.set('port', port);
http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + port);
});