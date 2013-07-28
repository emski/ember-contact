var express = require('express');
var app = express();

app.use(express.static(__dirname));
app.use('/static', express.static(__dirname));

app.get('/', function(req, res){
	res.render ();__dirname + "/index.html"
})
app.listen(process.env.PORT || 3006);
