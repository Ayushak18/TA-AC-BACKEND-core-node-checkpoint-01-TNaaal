let http = require('http');
let fs = require('fs');
let qs = require('querystring');
let url = require('url');

let server = http.createServer(handleServer);

let dir = __dirname;
let img = dir + '/assets';

function handleServer(req, res) {
  let parsedUrl = url.parse(req.url, true);
  let data = '';
  req.on('data', (content) => {
    data = data + content;
  });

  req.on('end', () => {
    if (req.url === '/' && req.method === 'GET') {
      fs.createReadStream(`${img}/index.png`).pipe(res);
    } else if (req.url === '/about' && req.method === 'GET') {
      fs.createReadStream(`${img}/about.png`).pipe(res);
    } else if (req.url === '/contact' && req.method === 'GET') {
      fs.createReadStream(`./index.html`).pipe(res);
    } else if (req.url === '/form' && req.method === 'POST') {
      let parsedData = qs.parse(data);
      fs.open(
        `${dir}/contacts/${parsedData.username}.json`,
        'wx',
        (error, fd) => {
          if (error) {
            res.setHeader('Content-type', 'text/html');
            res.end('<h1>Username Already Taken</h1>');
          } else {
            fs.write(fd, JSON.stringify(parsedData), (error) => {
              if (error) {
                console.log(error);
              } else {
                fs.close(fd, () => {
                  res.setHeader('Content-type', 'text/html');
                  res.end('<h1>File created</h1>');
                });
              }
            });
          }
        }
      );
    } else if (req.method === 'GET' && parsedUrl.pathname === '/user') {
      fs.createReadStream(
        `${dir}/contacts/${parsedUrl.query.username}.json`
      ).pipe(res);
    } else if (req.method === 'GET' && req.url === '/users') {
      fs.readdir('./contacts', (error, content) => {
        if (error) {
          console.log(error);
        } else {
          let users = content.reduce((acc, cv) => {
            acc = acc + cv + ' \n';
            return acc;
          }, '');
          res.end(users);
        }
      });
    }
  });
}

server.listen(5000, () => {
  console.log('Server is up and running at 5000');
});
