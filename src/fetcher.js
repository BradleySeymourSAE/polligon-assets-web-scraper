const fetch = require('node-fetch');

async function serverQuery(urlToFetch, headers ,method="GET",params){
    try {
        return await fetch(urlToFetch, {
            method: method,
            headers: headers,
            body: params
        });
    }catch (ex){
        return 500
    }
}

module.exports = {serverQuery}