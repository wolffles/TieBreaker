/*
sourceCheck is a module that provides helpers for checking the source of truth.
**/

module.exports = {
    isUsernameUnique: (username, roomData) => {
        return roomData.connectedPlayersList.indexOf(username) == -1
    }
};