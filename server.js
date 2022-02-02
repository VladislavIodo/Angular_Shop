const http = require("http");
const app = require('./server/backend');

const port = 3000;
const server = http.createServer(app);
server.listen(port, ()=>{
  console.log(`app listening at http://localhost:${port}`);
});


