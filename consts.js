module.exports = {
  client: {
    CONNECTION: 1, // 客户端连接过来
    NEWMESSAGE: 2, // 客户端发送消息
	EXITROOM:3, // 退出聊天室
	PING: 4 // 心跳ping
  },
  server: {
    CONNECTION_SUCCESS: 0, // 服务器告诉客户端
    NEWMESSAGE: 1, // 服务器发送新消息过去
	PONG: 2 // 心跳pong
  }
}