var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var server = app.listen(6969);

var staticDir = __dirname + '/public/';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
	res.sendFile(staticDir + 'index.html');
});

app.get('/messages', function (req, res) {
	showOldMsgs(res);
});

app.post('/messages', function (req, res) {
	var message = req.body;
	res.json(message);
	saveMsg(message, function(err){if(err) throw err;});
});

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chatappajax', function(err){
	if(err) {
		console.log(err);
	} else {
		console.log('Connected to mongodb!');
	}
});

var chatSchema = mongoose.Schema({
	name: String,
	text: String,
	created: {type: Date, default: Date.now}
});

var Chat = mongoose.model('message', chatSchema);

function showOldMsgs(res){
  getOldMsgs(69, function(err, docs){
		res.json(docs);
  });
}

var getOldMsgs = function(limit, cb){
	var query = Chat.find({});
	query.sort('created').limit(limit).exec(function(err, docs){
		cb(err, docs);
	});
}

var saveMsg = function(data, cb){
	var newMsg = new Chat({name: data.name, text: data.text});
	newMsg.save(function(err){
		cb(err);
	});
};
