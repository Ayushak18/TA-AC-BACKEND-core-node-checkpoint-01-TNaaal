let http = require('http');

let server = http.createServer(handleServer);

function handleServer(req, res) {}

server.listen(3000, () => {
  console.log('Server is up and running at 3000');
});
