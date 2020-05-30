$(function() {
    var FADE_TIME = 150; // ms
    var TYPING_TIMER_LENGTH = 400; // ms
    var COLORS = [
      '#e21400', '#91580f', '#f8a700', '#f78b00',
      '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
      '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];

    // Initialize variables
    var playerArea = document.getElementById("playerArea");
    var $window = $(window);
    var $usernameInput = $('.usernameInput'); // Input for username
    var $messages = $('.messages'); // Messages area
    var $inputMessage = $('.inputMessage'); // Input message input box
  
    var $loginPage = $('.login.page'); // The login page
    var $chatPage = $('.chat.page'); // The chatroom page
    var audio = document.getElementById('bell')
    let host = false
  
    $("#bellbtn").click(function() {
        document.getElementById("bellbtn").style.display = "none";
        audio.play(); // Play the empty element to get control
        setTimeout(function(){ audio.src = './assets/bell.m4a';  }, 3000);// Set the real audio source
    })
        

    // Prompt for setting a username
    var username;
    var id;
    var players = {};
    var connected = false;
    var typing = false;
    var lastTypingTime;
    var $currentInput = $usernameInput.focus();
  
    var socket = io();
  
    

socket.on('connect', function() {
  id = socket.id;
});

    const addParticipantsMessage = (data) => {
      var message = '';
      if (data.numUsers === 1) {
        message += "there's 1 participant";
      } else {
        message += "there are " + data.numUsers + " participants";
      }
      log(message);
    }
  
    // Sets the client's username
    const setUsername = () => {
      username = cleanInput($usernameInput.val().trim());
  
      // If the username is valid
      if (username) {
        $loginPage.fadeOut();
        $chatPage.show();
        $loginPage.off('click');
        // $currentInput = $inputMessage.focus();

        // Tell the server your username
        socket.emit('add user', {username:username, id:id});
      }
    }
  
    // Sends a chat message
    const sendMessage = () => {
      var message = $inputMessage.val();
      // Prevent markup from being injected into the message
      message = cleanInput(message);
      // if there is a non-empty message and a socket connection
      if (message && connected) {
        $inputMessage.val('');
        addChatMessage({
          username: username,
          message: message
        });
        // tell server to execute 'new message' and send along one parameter
        socket.emit('new message', message);
      }
    }
  
    // Log a message
      const log = (message, options) => {
      var $el = $('<p>').addClass('log').text(message);
      addMessageElement($el, options);
    }
  
    // Adds the visual chat message to the message list
    const addChatMessage = (data, options) => {
      // Don't fade the message in if there is an 'X was typing'
      var $typingMessages = getTypingMessages(data);
      options = options || {};
      if ($typingMessages.length !== 0) {
        options.fade = false;
        $typingMessages.remove();
      }
  
      var $usernameDiv = $('<span class="username"/>')
        .text(data.username)
        .css('color', getUsernameColor(data.username));
      var $messageBodyDiv = $('<span class="messageBody">')
        .text(data.message);
  
      var typingClass = data.typing ? 'typing' : '';
      var $messageDiv = $('<p class="message"/>')
        .data('username', data.username)
        .addClass(typingClass)
        .append($usernameDiv, $messageBodyDiv);

      addMessageElement($messageDiv, options);

    if (!$messageDiv[0].className.includes('typing'))
        if (data.username != username){
            audio.play()
        }
        
    }
  
    // Adds the visual chat typing message
    const addChatTyping = (data) => {
      data.typing = true;
      data.message = 'is typing';
      addChatMessage(data);
    }
  
    // Removes the visual chat typing message
    const removeChatTyping = (data) => {
      getTypingMessages(data).fadeOut(function () {
        $(this).remove();
      });
    }
  
    // Adds a message element to the messages and scrolls to the bottom
    // el - The element to add as a message
    // options.fade - If the element should fade-in (default = true)
    // options.prepend - If the element should prepend
    //   all other messages (default = false)
    const addMessageElement = (el, options) => {
      var $el = $(el);
  
      // Setup default options
      if (!options) {
        options = {};
      }
      if (typeof options.fade === 'undefined') {
        options.fade = true;
      }
      if (typeof options.prepend === 'undefined') {
        options.prepend = false;
      }
  
      // Apply options
      if (options.fade) {
        $el.hide().fadeIn(FADE_TIME);
      }
      if (options.prepend) {
        $messages.prepend($el);
      } else {
        $messages.append($el);
      }
      $messages[0].scrollTop = $messages[0].scrollHeight;
    }
  
    // Prevents input from having injected markup
    const cleanInput = (input) => {
      return $('<div/>').text(input).html();
    }
  
    // Updates the typing event
    const updateTyping = () => {
      if (connected) {
        if (!typing) {
          typing = true;
          socket.emit('typing');
        }
        lastTypingTime = (new Date()).getTime();
  
        setTimeout(() => {
          var typingTimer = (new Date()).getTime();
          var timeDiff = typingTimer - lastTypingTime;
          if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
            socket.emit('stop typing');
            typing = false;
          }
        }, TYPING_TIMER_LENGTH);
      }
    }
  
    // Gets the 'X is typing' messages of a user
    const getTypingMessages = (data) => {
      return $('.typing.message').filter(function (i) {
        return $(this).data('username') === data.username;
      });
    }
  
    // Gets the color of a username through our hash function
    const getUsernameColor = (username) => {
      // Compute hash code
      var hash = 7;
      for (var i = 0; i < username.length; i++) {
         hash = username.charCodeAt(i) + (hash << 5) - hash;
      }
      // Calculate color
      var index = Math.abs(hash % COLORS.length);
      return COLORS[index];
    }
  
    // Keyboard events
  
    document.getElementById("pages").addEventListener("keydown",(event) => {
      // Auto-focus the current input when a key is typed
      if (!(event.ctrlKey || event.metaKey || event.altKey)) {
        $currentInput.focus();
      }
      // When the client hits ENTER on their keyboard
      if (event.which === 13) {
        if (username) {
          sendMessage();
          socket.emit('stop typing');
          typing = false;
        } else {
          setUsername();
        }
      }
    });

    playerArea.addEventListener("change",(event) =>{
      console.log('change worked', event);
      let currentUsername = event.path[0].id.split(" ")[0];
      let currentEvent = event.path[0].id.split(" ")[1];
      console.log('here are the players', players);
      console.log('here is the username', currentUsername);
      players[currentUsername][currentEvent] = document.getElementById(event.path[0].id).value;
      socket.emit('update players',players);
      
      
    });

    $inputMessage.on('input', () => {
      updateTyping();
    });
  
    // Click events
  
    // Focus input when clicking anywhere on login page
    $loginPage.click(() => {
      $currentInput.focus();
    });
  
    // Focus input when clicking on the message input's border
    $inputMessage.click(() => {
      $inputMessage.focus();
    });

        document.getElementById('startGame').onclick = function(e){
        e.preventDefault()
        const life = document.getElementById('hp').value
        for (let player in players){
            players[player].life = life
        }
        socket.emit('update all players', players)
    }
  
    // Socket events
  
    // Whenever the server emits 'login', log the login message
    socket.on('login', (data) => {
      connected = true;
      // Display the welcome message
      var message = "Welcome to Simpchapp the simple chat app– ";
      log(message, {
        prepend: true
      });
      addParticipantsMessage(data);
      console.log('calling player area');

      if (data.numUsers == 1) {
            console.log("I'm the host");
            host = true;
            players[username] = {username: username,life:0};
            //this is only called for the host. Other users have the player data addeded when they receive game data from the host in the 'new player data' emit handler
            addPlayerArea();
      }else {
            console.log("I'm not the host");
      }
      
    });
  
    // Whenever the server emits 'new message', update the chat body
    socket.on('new message', (data) => {
      addChatMessage(data);
    });
  
    // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', (data) => {

      log(data.username + ' joined');
      addParticipantsMessage(data);
      players[data.username] = {username: data.username, life:0}
      createDiv(data.username,0)
      if (host === true){
         socket.emit('update new player', {players:players, id: data.id});
      }
    });
  
    // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', (data) => {
      log(data.username + ' left');
      addParticipantsMessage(data);
      removeChatTyping(data);
    });
  
    // Whenever the server emits 'typing', show the typing message
    socket.on('typing', (data) => {
      addChatTyping(data);
    });
  
    // Whenever the server emits 'stop typing', kill the typing message
    socket.on('stop typing', (data) => {
      removeChatTyping(data);
    });
  
    socket.on('disconnect', () => {
      log('you have been disconnected');
    });
  
    socket.on('reconnect', () => {
      log('you have been reconnected');
      if (username) {
        socket.emit('add user', {username:username, id:id});
      }
    });
  
    socket.on('reconnect_error', () => {
      log('attempt to reconnect has failed');
    });
  
    //player information that was received from host
      socket.on('update player data', (data) => {
        players = data;
        console.log('here is the player information', players);
        updatePlayerArea();
      });

  //new user receiving game data
      socket.on('new player data', (data) => {
        players = data;
        console.log('here is the player information', players);
        addPlayerArea();
      });
//updates specific div element that was just changed, keeping for furture brain storming
      socket.on('new specific data', (data) => {
        players = data.players;
        console.log('here is the player information', players);
        modifyDiv(data.username,data.event);
      });

    //***************************************** Handling Player Area

  

    function createDiv(currentUsername,currentLife) {
      let newDiv = document.createElement("div");
      newDiv.setAttribute('id',currentUsername);

      let nameDiv = document.createElement("div");
      nameDiv.setAttribute('id',currentUsername + " Area");
      nameDiv.innerHTML = currentUsername;
      let lifeDiv = document.createElement("input");
      lifeDiv.setAttribute('id',currentUsername + " life");
      lifeDiv.value = currentLife;
      
      newDiv.appendChild(nameDiv);
      newDiv.appendChild(lifeDiv);

      playerArea.appendChild(newDiv);
    }

    function modifyDiv(currentUsername, currentLife) {
        document.getElementById(currentUsername).children[1].value = currentLife;
    }
    
    
    function addPlayerArea(){
      for (var player in players) {
        createDiv(players[player].username,players[player].life);
      }
    }

    function updateOwnArea(){
        document.getElementById(username).children[1]
    }

    function updatePlayerArea(){
        for (var player in players) {
            modifyDiv(players[player].username,players[player].life);
          }
    }

  });
