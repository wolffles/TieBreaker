# TieBreaker
Useful tools for all for table top games

## features
* game unit counter ie: life/point/score display
* names


## Data flow for app
    * any kind of update that happens on client side that should effect the room will emit to server
        * server has 2 main emits for client state: ['update player state', 'update game state']
        * an 'update player state' should only emit to the client that changed it. (this emit is mainly for identifying who the player and client is with server information... ideally we dont want to use player state to update game state)
        * 'update game state' should emit when anything happens that isn't the client's identity (such as connected players or playerslist)
            * client takes information on update game state to change the board
            * after any 'update game state' client should request server message



## Backend objects
rooms {
    roomName:{
        roomID: '',
        roomName:""
        numUsers: 0,
        connectedPlayersList:[],
        savedPlayers: {
            playerObj:{
            username: "",
            id: "",
            life: 0,
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

## Frontend State
```
    UserInfo {
        messages: [],
        Players: {},
        PlayersList: [],
        connectedPlayersList: [],
        username: "",
        life: 0,
        id: '',
        color: '',
        host: boolean,
    }
```