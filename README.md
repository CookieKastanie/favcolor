# favcolor

Get dominant color of an favicon by giving a site url.

##  Installation
    npm i favcolor

## Usage
```js
const favcolor = require('favcolor');

const url = 'https://www.messenger.com';
favcolor.fromSiteFavicon(url).then(color => {
    console.log('Color from :', url, '=>', color.toHex());
}).catch(console.error);
```

## License
MIT
