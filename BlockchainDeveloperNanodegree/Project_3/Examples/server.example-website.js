// Http library
const http = require('http');
// File service library
const fs = require('fs');
// Http port
const port = 3000;
// Filename for file service to load
const filename = "index.html";
// Configure web service
const app = http.createServer(function (request, response){
  response.writeHead(200, {"Content-Type": "text/html"});
  response.end(fs.readFileSync(__dirname + "/" + filename));
});

// Notify console
console.log("Web Server started on port 3000\nhttp://localhost:"+port);

// Start server with http port
app.listen(port);
