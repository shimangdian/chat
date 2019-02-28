const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws')
const consts = require('./consts.js')

const app = express();

const server = http.createServer(app)
const myWss = new WebSocket.Server({ server })

app.use(function (req, res) {
  res.send({ msg: "hello" });
});


myWss.on('connection', function connection(wsClient) {
  wsClient.on('message', function incoming(message) {
    message = JSON.parse(message)
    switch (message.action) {
      case consts.client.CONNECTION: 
        wsClient.send(JSON.stringify({action:consts.server.CONNECTION_SUCCESS, content:'连接成功'}))
        break
      case consts.client.NEWMESSAGE: 
        myWss.clients.forEach(function each(client) {
          console.log(client.readyState, WebSocket.OPEN)
          if (client.readyState === WebSocket.OPEN) {
            message.action = consts.server.NEWMESSAGE
            client.send(JSON.stringify(message)) // 符合条件的客户端都发送
          }
        })
        break
      default: 
		break
    } 
  })
})

server.listen(8081, function listening() {
  console.log('Listening on %d', server.address().port);
});
