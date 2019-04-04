/*
 * PDM RESTful JSON for API
 *
 */

// Dependencies
var http          = require('http');
var https         = require('https');
var url           = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var server        = require('./lib/server');
var cluster       = require('cluster');
var os            = require('os');

const MSG_WELLCOME = 'Wellcome to my first homework.'


// If we're on the master thread, start the background workers and the CLI
if(cluster.isMaster){

  // Fork the process
  for(var i = 0; i < os.cpus().length; i++){
    cluster.fork();
  }
}
else{
  server.init();
}
