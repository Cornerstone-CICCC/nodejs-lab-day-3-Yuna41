const chatForm = document.getElementById('form-chat')
const messages = document.getElementById('all-messages')
const usernameInput = document.getElementById('input-username')
const messageInput = document.getElementById('input-message')

const socket = io("http://localhost:3500") // backend url

let currentUsername = null

// socket.on(event, callback(data)) … listen to event messages

// socket.emit(event, data) … emit message to client
// socket.broadcast.emit(ev, data) … emit message to everyone except client
// io.emit(ev, data) … emit message to all clients

async function loadAllMessages() {
  try{
    const res = await fetch("http://localhost:3500/api/chat")
    const chats = await res.json()

    chats.forEach(c => {
      appendMessage(c)
    })
  } catch(err){
    console.error("Failed to load all messages:", err)
  }
}

function appendMessage(c){
  const li = document.createElement('li')
  li.innerHTML = `<span>${c.username}</span>: ${c.message}`
  messages.appendChild(li)
}

function prependMessage(c){
  const li = document.createElement('li')
  li.innerHTML = `<span>${c.username}</span>: ${c.message}`
  messages.prepend(li)
}

socket.on('newMessage', (c) => {
  prependMessage(c)
})                       

chatForm.addEventListener('submit', function(e) {
  e.preventDefault()

  if(!currentUsername){
    currentUsername = usernameInput.value.trim()
    if(!usernameInput.value.trim()){
      alert("Enter username first!")
      return
    }
    usernameInput.disabled = true
  }

  const message = messageInput.value.trim()
  if(!message){
    alert("Enter message!")
    return
  }

  socket.emit('sendMessage', {
    username: currentUsername,
    message
  })

  messageInput.value = ""
})

loadAllMessages()