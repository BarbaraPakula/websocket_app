const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');


let userName = '';

const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content))


loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const login = e => {
    if (userNameInput.value) {
      userName = userNameInput.value;
      loginForm.classList.toggle('show');
      messagesSection.classList.toggle('show');
      socket.emit('join', userName);
    } else {
      alert('You have to log in- type your name');
    }
  }
  login(e);
});


addMessageForm.addEventListener('submit', e => {
  e.preventDefault();
  const sendMessage = () => {
    if (messageContentInput.value) {
      addMessage(userName, messageContentInput.value)
      socket.emit('message', { author: userName, content: messageContentInput.value})
      messageContentInput.value = '';
    } else {
      alert('Please write your message')
    }

  }
  sendMessage();
})

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if (author === userName) message.classList.add('message--self');
  message.innerHTML = `
      <h3 class="message__author">${userName === author ? 'You' : author}</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
  messagesList.appendChild(message);
}
