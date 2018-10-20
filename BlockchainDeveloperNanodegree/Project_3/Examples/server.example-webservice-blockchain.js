// Http library
const http = require('http');
// Http port
const port = 8080;
// Configure web service
const app = http.createServer(function (request, response){
  response.writeHead(200, {"Content-Type": "application/json"});
  let block = {"height":"0","body":"123"};
  response.write(JSON.stringify(block));
  response.end();
});

// Notify console
console.log("Web Server started on port 3000\nhttp://localhost:"+port);

// Start server with http port
app.listen(port);
