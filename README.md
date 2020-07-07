# TieBreaker
Useful tools for all for table top games

## features
* game unit counter ie: life/point/score display
* names

## Backend objects
rooms {
    roomName:{
        roomID: '',
        roomName:""
        numUsers: 0,
        connectedPlayersList:[],
        savedPlayers: {
            playerObj:{},
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