/*
 * PDM RESTful JSON for API
 *
 */

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

const MSG_WELLCOME = 'Wellcome to my first homework.'

 // Instantiate the HTTP server
var httpServer = http.createServer((req, res)=>{
  _server(req,res)
});

// Start the HTTP server
httpServer.listen(config.httpPort,function(){
  console.log('The \x1b[32m\x1b[1mHTTP\x1b[0m server is running on port '+config.httpPort);
});

// Instantiate the HTTPS server
var httpsServer = https.createServer(config.ssl,(req, res)=>{
  _server(req,res)
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort,function(){
 console.log('The \x1b[31m\x1b[1mHTTPS\x1b[0m server is running on port '+config.httpsPort);
});

// All the server logic for both the http and https server
var _server = function(req,res){

  // Parse the url
  var parsedUrl = url.parse(req.url, true);
  var _path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  _path = _path ? _path.toLowerCase() :_path;

  // Get the payload,if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
      buffer += decoder.write(data);
  });
  req.on('end', function() {
      buffer += decoder.end();

      // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
      var chosenHandler = typeof(router[_path]) !== 'undefined' ? router[_path] : handlers.notFound;

      // Construct the data object to send to the handler
      var data = {
        // Get the path
        'path' : _path,
        // Get the query string as an object
        'qsObj' : parsedUrl.query,
        // Get the HTTP method
        'method' : req.method.toLowerCase(),
        //Get the headers as an object
        'headers' : req.headers,
        // Get the payload,
        'payload' : buffer
      };

      // Route the request to the handler specified in the router
      chosenHandler(data,(statusCode,payload) => {

        // Use the status code returned from the handler, or set the default status code to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        // Use the payload returned from the handler, or set the default payload to an empty object
        payload = typeof(payload) == 'object'? payload : {};

        // Convert the payload to a string
        var payloadString = JSON.stringify(payload);

        // Return the response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
        console.log(data.method, ' : ', data.path, '-',statusCode);
      });

  });
};

// Define all the handlers
var handlers = {};

handlers.ping = function(data,callback){
    callback(200, { echo : data.payload});
};

handlers.hello = function(data,callback){
    callback(200, {msg : MSG_WELLCOME});
};

handlers.notFound = function(data,callback){
  callback(404, { msg : 'Endpoint not found.'});
};

//  Router
var router = {
  'ping'  : handlers.ping,
  'hello' : handlers.hello 
};
