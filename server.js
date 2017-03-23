// npm start
var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(process.env.PORT || 8080);
console.log("Server listening on: http://localhost:%s", 8080);