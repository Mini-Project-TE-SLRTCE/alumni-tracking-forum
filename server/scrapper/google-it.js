const googleIt = require('google-it');

const googleHandler = async (query) => {
    const data = await googleIt({
        'query': `site:linkedin.com AND "${query}" AND "SLRTCE"`,
        'no-display': true,
    }).then(result => {
        return result;
    }).catch(error => {
        console.log(error);
        return null;
    })

    return data;
}

module.exports = googleHandler;