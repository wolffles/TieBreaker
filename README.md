# TieBreaker
A MERN stack application (with React Hooks) that contains useful tools for players to record scores and chat remotely. It utilizies Socket.io to let players make changes instantaneously.

[TieBreaker](https://tie-breaker7.herokuapp.com/)

## Features
* Game unit counter ie: score/point/score display
* Real-time chat
* A real-time dice and coin flip feature.
* A player chooser feature that picks connected players at random
* Multiple game rooms for players to connect
* The use of selenium for functional testing

## Technologies
* Socket.io
* Node.js
* React
* React Hooks
* Selenium

## Data flow for app
    * Any kind of update that happens on the client side should affect what the room will emit to server
        * The server has 2 main emits for client state: ['update player state', 'update game state']
        * An 'update player state'  emit should only emit to the client that changed it (this emit is mainly for identifying who the player and client is with server information... ideally we dont want to use player state to update game state).
        * Data flow for update game state (expect for player area inputs): 
            1. client updates state
            2. client calls 'update players' event
            3. server sends data back to clients (sender can be included or excluded based on noRender boolean)
        * 'update game state' should emit when anything happens that didn't originate from the local client (such as connected players or playerslist)
            * Client takes information on update game state to change the board
            * After any 'update game state' client should request server message

## Backend objects
```
rooms {
    roomName:{
        roomID: '',
        roomName:""
        numUsers: 0,
        connectedPlayersList:[],
        broadcast: false,
        savedPlayers: {
            playerObj:{
                username: "",
                id: "",
                points: [['title','points']],
                password: "", 
                color: getUsernameColor(username),
                roomName: "",
                messages: [['Welcome To TieBreaker', undefined]]
            },
            ...
        },
        savedPlayersList:['playernames'],
        toBroadcast: {
            userJoined: "",
            userLeft: "",
            userRemoved: "",
        }

    }
}
```

## Frontend State
```
    UserInfo {
        messages: [],
        Players: {},
        PlayersList: [],
        connectedPlayersList: [],
        username: "",
        score: 0,
        score2: 0,
        id: '',
        color: '',
        host: boolean,
    }
```

