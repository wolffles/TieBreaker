const fetch = require('node-fetch');
module.exports = {
    wake : function() {
        let handler
        //runs first time server runs
        fetch("https://tie-breaker.herokuapp.com")
                .then(res => console.log(`response-ok: ${res.ok}, status: ${res.status}`))
                .catch(err => console.error(`Error occured: ${err}`));
        //loops
        try {
            handler = setInterval(() => {
                fetch("https://tie-breaker.herokuapp.com")
                .then(res => console.log(`response-ok: ${res.ok}, status: ${res.status}`))
                .catch(err => console.error(`Error occured: ${err}`));
            }, 25*60*1000);
            } catch(err) {
                console.error('Error occured: retrying...');
                clearInterval(handler);
                return setTimeout(() => wake(), 10000);
        };
    }
}