const favcolor = require('./index.js');

const url = 'https://www.messenger.com';
favcolor.fromSiteFavicon(url).then(color => {
    console.log('Color from :', url, '=>', color.toHex());
}).catch(console.error);
