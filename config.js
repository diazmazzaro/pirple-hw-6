/*
 * Configuration variables
 *
 */

 // Dependencies
var fs = require('fs');

// environments
var environments = {
	// Staging (default) environment
	staging : {
	  'httpPort'  : 2602,
	  'httpsPort' : 2601,
	  'envName'   : 'staging',
	  'ssl'       : {
	  	'key': fs.readFileSync('./ssl/key.pem'),
		  'cert': fs.readFileSync('./ssl/cert.pem')
		},
	},

	// Production environment
	production : {
	  'httpPort'  : 3012,
	  'httpsPort' : 3011,
	  'envName'   : 'production',
	  'ssl'       : {
	  	'key': fs.readFileSync('./ssl/key.pem'),
		  'cert': fs.readFileSync('./ssl/cert.pem')
		},
	}
}

// Determine which environment was passed as a command-line argument
var env = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Export the module
module.exports = typeof(environments[env]) == 'object' ? environments[env] : environments.staging;
