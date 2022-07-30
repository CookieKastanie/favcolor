const favcolor = require('./index.js');

favcolor.fromImageUrl('https://www.site.com/image.png').then(color => {
    console.log('Color from png url =>', color.toHex());
}).catch(console.error);

favcolor.fromSiteFavicon('https://www.site.com').then(color => {
    console.log('Color from site =>', color.toHex());
}).catch(console.error);
