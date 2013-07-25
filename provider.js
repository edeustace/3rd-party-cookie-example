var fs = require('fs'),
  http = require('http'),
  express = require('express'),
  packageJson = require('./package.json');

var app = express();

app.use(express.bodyParser());
app.use(express.cookieParser('hello there sir - secret')); //<-- "Secret" to actually be secret

app.set('views', __dirname + '/provider/views');
app.set('view engine', 'jade');

app.get('/', function(req,res,next){
  res.cookie('provider_cookie', 'hello there', { expires: new Date(Date.now() + 900000), httpOnly: true });
  res.render('index')
});

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