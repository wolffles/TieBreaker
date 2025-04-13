import io from 'socket.io-client';



const getSocketHost = () => {
    if (window.location.hostname === 'localhost') {
        return 'http://localhost:3001';
    }
    // For production, use the current hostname with HTTPS
    return `https://${window.location.hostname}`;
};

console.log('here is the host server', getSocketHost());


export const socket = io(getSocketHost(), {
    transports: ['polling'],  // Start with polling only
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    path: '/socket.io/',
    secure: window.location.hostname !== 'localhost',
    withCredentials: true
});

// // Log connection events for debugging
// socket.on('connect', () => {
//     console.log('Socket connected successfully');
// });

// to server
export const sendMessage = (data) => {
    socket.emit('message', data);
}

export const addUser = (data) => {
    socket.emit('add user', data)
}

export const updatePlayers = (data) => {
    socket.emit('update players', data)
}

export const updatePlayerInfo = (data) => {
    socket.emit('update player info', data)
}

//from server
