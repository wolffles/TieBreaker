/*
sourceCheck is a module that provides helpers for checking the source of truth.
**/

module.exports = {
    isUsernameUnique: (username, roomData) => {
        return roomData.savedPlayersList.indexOf(username) == -1
    },
    isUsernameConnected: (username, roomData) => {
        return roomData.connectedPlayersList.indexOf(username) == -1
    },
    modifyUsername: (username, roomData) => {
        let reg = /\d+$/
        let sub = username.match(reg)
        // if substring doesn't have any numbers(null) else add on to it
        username = sub == null ? username+'1' : username.replace(reg,(Number(sub)+1))
        while (roomData.savedPlayersList.indexOf(username) != -1){
            sub = username.match(reg)
            username = username.replace(reg,(Number(sub)+1))
        }
        return username 
    },
    diceToss: (sides) => {
        let num = Math.floor(Math.random() * sides) + 1
        return {result: num, diceType: sides}
    }, coinToss: () => {
        return Math.floor(Math.random() * 6) + 5;
        //return number of flips from 5 to 10
    }, choosePlayer: (playersList) => {
        let array = [];
       if(playersList.length >= 3){
        while (array.length < 13){
            let num = Math.floor(Math.random() * playersList.length)
            array.push(playersList[num])
          }
       } else if (playersList.length == 2) {
           let num = Math.floor(Math.random() * 2);
        while (array.length < 13){
            array.push(playersList[num])
            if(num == 1){
                num = 0
            } else {
                num = 1
            }
          }  
       }else {
           array = playersList;
       }
       return array;
    }

}