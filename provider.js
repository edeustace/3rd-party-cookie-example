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

  console.log("------ app.get /");
  console.log(req.query);
  console.log(req.cookies);

  var agent = req.headers['user-agent'];

  console.log("user agent is: " + agent, isSafari(agent));

  if(req.query.set_safari_cookie && !req.cookies.provider_cookie){
    console.log("set_safari_cookie == true")
    console.log("Set the cookie for safari then redirect back to the referrer");
    res.cookie('provider_cookie', 'hello there', { expires: new Date(Date.now() + 900000), httpOnly: true });
    res.send("<html><script>window.top.location='"+ decodeURIComponent(req.query.original_path) +"';</script>");
    return;
  }
  else {
    var referrer = req.get("Referrer");
    if( needsARedirect(agent)   && !req.cookies.provider_cookie ){
      console.log("need to do a redirect")
      var r = encodeURIComponent(referrer);
      console.log("Ref: " + r)
      res.send( "<html><script> window.top.location=window.location + '?set_safari_cookie=true&original_path="+ r +"';</script></html>")
    } else {
      res.cookie('provider_cookie', 'hello there', { expires: new Date(Date.now() + 900000), httpOnly: true });
      res.render('index')
    }
  }
});

var needsARedirect = function(ua){
  return isSafari(ua) || isIE(ua);
}

var isSafari = function(ua){
  return ua.indexOf("Safari/") != -1 && ua.indexOf("Chrome") == -1;
}

var isIE = function(ua){
  return ua.indexOf("MSIE") != -1;
}

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