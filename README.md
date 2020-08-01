# TieBreaker
Useful tools for all for table top games

## features
* game unit counter ie: score/point/score display
* real-time chat
* a real-time chat and coin fliip feature. There is also a feature that allows players to randomly choose one of the connected players


## Data flow for app
    * any kind of update that happens on client side that should effect the room will emit to server
        * server has 2 main emits for client state: ['update player state', 'update game state']
        * an 'update player state' should only emit to the client that changed it. (this emit is mainly for identifying who the player and client is with server information... ideally we dont want to use player state to update game state)
        *data flow for update game state (expect for player area inputs): 
            1. client updates state
            2. client calls 'update players' event
            3. server sends data back to clients (sender can be included or excluded based on noRender boolean)
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
        broadcast: false,
        savedPlayers: {
            playerObj:{
                username: "",
                id: "",
                score: 0,
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
        score: 0,
        score2: 0,
        id: '',
        color: '',
        host: boolean,
    }
```



    const initialState = {count: 0};

    function reducer(state, action) {
    switch (action.type) {
        case 'increment':
        return {count: state.count + 1};
        case 'decrement':
        return {count: state.count - 1};
        default:
        throw new Error();
    }
    }

    function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <>
        Count: {state.count}
        <button onClick={() => dispatch({type: 'decrement'})}>-</button>
        <button onClick={() => dispatch({type: 'increment'})}>+</button>
        </>
    );
    }