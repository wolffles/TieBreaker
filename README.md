# TieBreaker
Useful tools for all for table top games

## features
* game unit counter ie: life/point/score display
* names

## Backend objects
rooms {
    roomName:{
        connectedPlayersList:[],
        savedPlayers: {
            playerObj:{},
            ...
        },
        savedPlayersList:['playernames'],
        numUsers: 0,
        

    }
}

## Frontend State
```
    UserInfo {
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