'use strict';
//Installed Module 
var express = require('express'),
	app = express(),
	http=require("http"),
	mysql=require("mysql");

//Included Files
var config=require('./config/config')(),
	database=require('./config/database');

var connection = mysql.createConnection({
  host     : database.host,
  user     : database.username,
  password : database.password,
  database : database.database
});

//Check logged in or not
function requireLogin(req, res, next) {
  if (req.session.loggedIn) 
  {
    next(); // allow the next route to run
  }
  else 
  {
    res.redirect("/admin/login"); // or render a form, etc.
  }
}

connection.connect(function (error) {
  	if(error) 
  	{
    	console.error('error occured during mysql db connection: ' + error.stack);
     	return;
 	}
  	console.log('connected as id ' + connection.threadId);
});

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
// Automatically apply the `requireLogin` middleware to all
// routes starting with `/admin`
app.all("/admin/*", requireLogin, function(req, res, next) {
  next(); // if the middleware allowed us to get here,
          // just move on to the next route handler
});

app.get("/admin/posts", function(req, res) {
  // if we got here, the `app.all` call above has already
  // ensured that the user is logged in
});

app.set('view engine', 'ejs');

require('./routes/routes')(app);

http.createServer(app).listen(config.port, function(){
    console.log('Express server listening on port ' + config.port);
});