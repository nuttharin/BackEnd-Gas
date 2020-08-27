// const https = require('https');
// const app = require('./app');


// // https.createServer(function (req, res) {
// //     res.writeHead(200, {'Content-Type': 'text/plain'});
// //     res.write('Hello World!');
// //     res.end();
// // }).listen(8080);

// const port = process.env.PORT || 8080 ;

// const server = https.createServer(app)



// server.listen(port , function(){
//     console.log('Starting node.js on port ' + port)
// })

const http = require('http')

const app = require('./app');


const port = process.env.PORT || 8080

const server = http.createServer(app)

// server.on('listening',function(){
//     console.log('ok, server is running');
// });



server.listen(port , function(){
    console.log('Starting node.js on port ' + port)
})