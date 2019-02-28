var messageType = {
  OPEN_SUCCESS: 0,
  NEW_MESSAGE: 1
}
var ws = new WebSocket('ws://ws.heiwawa.xyz/ws')
// var ws = new WebSocket('ws://192.168.1.103:8080')
var heartTimer = null // 心跳timer
var heartTimerDealy = 1000 * 10 // 心跳间隔  10s
var messageDealy = 1000 * 3
var lastMessageDate = ''
var inRoom = false
var user = {
  nickName: '',
  action: 1,
  id: Math.floor(Math.random() * 1000)
}
ws.onopen = function () {
  user.nickName = prompt('请输入你的昵称').trim()
  user.nickName = user.nickName.replace(/柳|后|羿|liu|hou|yi|lhy/g,function(match){
    return '*';
  })
  ws.send(JSON.stringify(user))
}
ws.onclose = function () {
    console.log('ws链接关闭了')
    inRoom = false
    document.getElementById('send_btn').value = '已关闭链接'
}
ws.onerror = function () {
    console.log('ws链接出现错误')
    ws.close()
}
ws.onmessage = function (evt) { 
  var received_msg = JSON.parse(evt.data)
  switch (received_msg.action) {
    case messageType.OPEN_SUCCESS: 
      inRoom = true
      sendHeart()
      document.getElementById('send_btn').value = '发送'
      break
    case messageType.NEW_MESSAGE: 
      randerMessage(received_msg)
      break
    default:
      break
  }
};
document.onkeydown = function(e) {
  var keyNum = window.event ? e.keyCode :e.which;
  if(keyNum == 13 && document.getElementById('message').value.length > 0){  
    say()
  } 
}
function sendHeart () {
  if (!inRoom) {
    alert('尚未链接到聊天室，刷新页面以重新连接！')
    return
  }
  var heartObj = {
    action: 4
  }
  heartTimer = setInterval(function () {
   wssend(heartObj)
  }, heartTimerDealy)
}
function say () {
  let now = new Date()
  if (!inRoom) {
    alert('尚未链接到聊天室，刷新页面以重新连接！')
    return
  }
  if (lastMessageDate && now - lastMessageDate <= messageDealy) {
    alert('请不要过于频繁的发送消息')
    return
  }
  lastMessageDate = now
  var message = document.getElementById('message')
  if (message.value.length <= 0 ) return 
  sendMessage(message.value)
  message.value = ''
  message.focus()
}
function sendMessage (message) {
  var sayObj = {
    content: message,
    nickName: user.nickName,
    user: user.id,
    action: 2
  }
  if (ws.readyState === 1) {
    wssend(sayObj)
  }
}
function wssend (obj) {
    ws.send(JSON.stringify(obj))
}
function randerMessage (message) {
  var messageBox = document.getElementById('messageBox')
  var messageItem = document.createElement('li')
  var tag = message.content.substr(0, 3) === 'yg '
  if (tag) {
    message.content = message.content.substr(3)
  }
  var str = (message.nickName ? message.nickName : message.user) + ':' + message.content
  if (tag) {
    messageItem.innerHTML = str
  } else {
    messageItem.innerText = str
  }
  messageBox.appendChild(messageItem)
  messageBox.scrollTop = messageBox.scrollHeight
}

var btn = document.getElementById('send_btn')
btn.addEventListener('click', say)