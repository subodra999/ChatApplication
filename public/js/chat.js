const socket =  io();

// Elements ....
const $msgForm = document.querySelector('#msg-form')
const $msgFormInput = $msgForm.querySelector('input')
const $msgFormButton = $msgForm.querySelector('button')
const $messages = document.querySelector('#messages')

// Templates ....
const messageTemplate = document.querySelector('#message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // new message element
    const $newMessage = $messages.lastElementChild;

    // height of the message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // visible height
    const visibleHeight = $messages.offsetHeight;

    // height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}

socket.on('message', (msg) => {
    console.log(msg);
    const html = Mustache.render(messageTemplate, {
        username: msg.username,
        message : msg.text,
        createdAt : moment(msg.createdAt).format('h:mm a')    
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})


$msgForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $msgFormButton.setAttribute('disabled', 'disabled')

    const msg = e.target.elements.message.value;

    socket.emit('sendMessage', msg, (error) => {

        $msgFormButton.removeAttribute('disabled');
        $msgFormInput.value = "";
        $msgFormInput.focus();

        if(error) {
            return console.log(error);
        }
        console.log("Message delivered!")
    });

})

socket.emit('join', { username,room }, (error) => {
    if(error) {
        alert(error);
        location.href = "/";
    }
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html;    

})