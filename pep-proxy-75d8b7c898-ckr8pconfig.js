var config = {};

config.account = {
     host: '35.202.202.92',
     port: 3000
}

// Used only if https is disabled
config.pep_port = 80;

// Set this var to undefined if you don't want the server to listen on HTTPS
config.https = {
    enabled: false,
    cert_file: 'cert/cert.crt',
    key_file: 'cert/key.key',
    port: 443
}

config.idm = {
	host: '35.202.202.92',
	port: 3000,
	ssl: false
}

config.app = {
	host: '35.239.133.95',
	port: '1026',
	ssl: false // Use true if the app server listens in https
}


// Credentials obtained when registering PEP Proxy in app_id in Account Portal
config.pep = {
	app_id: 'd74e74c5-6fa7-4dbf-89e3-60b379eab792',
	username: 'pep_proxy_e8e111f2-cc5b-4a70-9e73-451743ae9391',
	password: 'pep_proxy_fdfaed43-a9e8-48a6-bcb2-9c908030662e',
	//trusted_apps : []
}

// in seconds
config.cache_time = 300;

// if enabled PEP checks permissions in two ways:
//  - With IdM: only allow basic authorization
//  - With Authzforce: allow basic and advanced authorization. 
//	  For advanced authorization, you can use custom policy checks by including programatic scripts 
//    in policies folder. An script template is included there 
// 
//	This is only compatible with oauth2 tokens engine

config.authorization = {
	enabled: false,
	pdp: 'idm', 	// idm|authzforce  
	azf: {
		protocol: 'http',
	    host: 'localhost',
	    port: 8080,
	    custom_policy: undefined // use undefined to default policy checks (HTTP verb + path).
	} 
}

// list of paths that will not check authentication/authorization
// example: ['/public/*', '/static/css/']
config.public_paths = [];

config.magic_key = undefined;

module.exports = config;
