// express module for webservice functionality
var express = require(__dirname + '/node_modules/express');
// bodyparser for acception JSON encoded bodies
var bodyParser = require(__dirname + '/node_modules/body-parser');
// shelljs for executing shell commands
// var shell = require(__dirname + '/node_modules/shelljs');

const { spawn } = require('child_process');


var app = express();
// Prefix to our web service methods. CoreService creates configuration similar to this for each installed application
var ws_prefix = '/app/backend/nodenursample/';

// Support JSON-encoded bodies
app.use( bodyParser.json() ); 

// Support URL-encoded bodies
app.use(bodyParser.urlencoded({ 
  extended: true
}));



// TODO: HANDLE ERRORS and show in UI RED LOGO
// NUR_ERROR_TR_NOT_CONNECTED = 4098; 

//  NUR_ERROR_G2_TAG_INSUF_POWER  => if the TAF is too far away

// NUR_ERROR_G2_WRITE  => ERROR on writing with SAMPO S1


// Performs an inventory using default rounds, Q and session and returns a JSON-array containing hex-string representation of EPCs seen in the RF-field
app.get(ws_prefix + 'inventory', function (req, res) {
        // Sync call to exec()
        // var ret = shell.exec(__dirname + '/nurconrpi 1', {silent:true}).stdout;
		
		const ret = spawn( __dirname +'\\nurcon.exe', ['1']);

		ret.stdout.on('data', (data) => {
		  console.log(`stdout: ${data}`);
		  res.setHeader('Content-Type', 'application/json');
		  console.log("data read from chip", data);
        res.end(JSON.stringify(data)); //res.end(ret);
		});

		
		// TODO: handle ERROR code for busy and not connected
		
		ret.stderr.on('data', (data) => {
		  console.log(`stderr: ${data}`);
		});

		ret.on('close', (code) => {
		  console.log(`child process exited with code ${code}`);
		});

		
		/*
        console.log(ret);
        var reslines = ret.match(/[^\r\n]+/g);
		res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(reslines)); //res.end(ret);
		*/
		
		
		
});

// Read data from tag singulated by tag's EPC memory and return a hex-string representation of the read data
app.post(ws_prefix + 'readTagByEPC', function(req, res) {
        var epc = req.body.epc;
        var bank = req.body.bank;
        var wordAddress = req.body.wordAddress;
        var readByteCount = req.body.readByteCount;
		console.log("readTagByEPC " + epc + " " + bank + " " + wordAddress + " " + readByteCount);
        /*var ret = shell.exec(__dirname + '/nurconrpi 2 ' + epc + ' ' + bank + ' ' + wordAddress + ' ' + readByteCount, {silent:true}).stdout;*/
		
		const ret = spawn( __dirname +'\\nurcon.exe', ['2', epc, bank, wordAddress, readByteCount]);

		ret.stdout.on('data', (data) => {
		  console.log(`stdout: ${data}`);
		  res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data)); //res.end(ret);
		});

		
		// TODO: handle ERROR code for busy and not connected
		
		ret.stderr.on('data', (data) => {
		  console.log(`stderr: ${data}`);
		});

		ret.on('close', (code) => {
		  console.log(`child process exited with code ${code}`);
		});

		
		

        
});



app.post(ws_prefix + 'writeTagByEPC', function(req, res) {
        var epc = req.body.epc;
        var bank = req.body.bank;
        var wordAddress = req.body.wordAddress;
		// data must be hexa data
        var data = req.body.data;
		console.log("writeTagByEPC " + epc + " " + bank + " " + wordAddress + " " + data);
        /*var ret = shell.exec(__dirname + '/nurconrpi 2 ' + epc + ' ' + bank + ' ' + wordAddress + ' ' + readByteCount, {silent:true}).stdout;*/
		
		const ret = spawn( __dirname +'\\nurcon.exe', ['3', epc, bank, wordAddress, data]);

		ret.stdout.on('data', (data) => {
		  console.log(`stdout: ${data}`);
		  res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data)); //res.end(ret);
		});
		
		
		// TODO: handle ERROR code for busy and not connected

		ret.stderr.on('data', (data) => {
		  console.log(`stderr: ${data}`);
		});

		ret.on('close', (code) => {
		  console.log(`child process exited with code ${code}`);
		});

		        
});


// Start listening at port 10126
var server = app.listen(10126, function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("port", port);
  console.log("host", host);
  
  console.log("Example app listening at http://%s:%s", host, port)
});

