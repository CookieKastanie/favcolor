const https = require('https');
const PNG = require('pngjs').PNG;

const favorBright = (r, g, b) => {
    return (r * r + g * g + b * b) / 65535 * 20 + 1;
}

const favorHue = (r, g, b) => {
    return (Math.abs(r - g) * Math.abs(r - g) + Math.abs(r - b) * Math.abs(r - b) + Math.abs(g - b) * Math.abs(g - b)) / 65535 * 50 + 1;
}

const doesRgbMatch = (rgb, r, g, b) => {
    if(rgb == null) return true;

    r = r >> rgb.d;
    g = g >> rgb.d;
    b = b >> rgb.d;

    return rgb.r == r && rgb.g == g && rgb.b == b;
}

const parseImageData = (image) => {    
    const { width, height, data } = image;
    const result = {};

    for(let y = 0; y < height; ++y)
    for(let x = 0; x < width; ++x) {
        const i = (width * y + x) << 2;

        if(data[i + 3] <= 32) continue;

        const key = `${data[i]},${data[i + 1]},${data[i + 2]}`;

        if(key in result) {
            const rgb = result[key];
            ++rgb.count;
        } else {
            const rgb = {
                r: data[i],
                g: data[i + 1],
                b: data[i + 2],
                count: 1
            };

            rgb.weight = favorHue(rgb.r, rgb.g, rgb.b);
            if(rgb.weight <= 0) rgb.weight = 1e-10;

            result[key] = rgb;
        }
    }

    return result;
};

const mostProminentRGB = (pixels, degrade, rgbMatch) => {
    const rgb = {r: 0, g: 0, b: 0, count: 0, d: degrade};
    const db = {};
    let count = 0;

    for(let pixelKey in pixels) {
        const pixel = pixels[pixelKey];
        totalWeight = pixel.weight * pixel.count;
        ++count;

        if(doesRgbMatch(rgbMatch, pixel.r, pixel.g, pixel.b)) {
            const pixelGroupKey = `${pixel.r >> degrade},${pixel.g >> degrade},${pixel.b >> degrade}`;

            if(pixelGroupKey in db)
                db[pixelGroupKey] += totalWeight;
            else
                db[pixelGroupKey] = totalWeight;
        }
    }

    for(let i in db) {
        const data = i.split(',');
        const r = data[0];
        const g = data[1];
        const b = data[2];

        count = db[i];

        if (count > rgb.count) {
            rgb.r = r;
            rgb.g = g;
            rgb.b = b;
            rgb.count = count;
        }
    }

    return rgb;
};

const findColor = (image) => {
    const data = parseImageData(image);

    let rgb = null;

    rgb = mostProminentRGB(data, 6, rgb);
    rgb = mostProminentRGB(data, 4, rgb);
    rgb = mostProminentRGB(data, 2, rgb);
    rgb = mostProminentRGB(data, 0, rgb);

    return {
        r: parseInt(rgb.r),
        g: parseInt(rgb.g),
        b: parseInt(rgb.b),
        toHex() {
            const rh = this.r.toString(16).padStart(2, '0');
            const gh = this.g.toString(16).padStart(2, '0');
            const bh = this.b.toString(16).padStart(2, '0');
            
            return `${rh}${gh}${bh}`;
        }
    };
}

const cache = {};
const CACHE_DURATION = 8.64e+7 // 24h in ms

module.exports = {
    fromSiteFavicon: url => {
        return new Promise((resolve, reject) => {
            if(url in cache) {
                const cached = cache[url];
                if((cached.date + CACHE_DURATION) > Date.now()) {
                    resolve(cached.color);
                    return;
                }
            }

            const options = {
                hostname: 't3.gstatic.com',
                path: `/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}/&size=16`,
                method: 'GET'
            };

            const req = https.request(options, res => {
                if(res.statusCode != 200) {
                    reject(res.statusCode);
                    return;
                }
    
                res.pipe(new PNG()).on('parsed', function() {
                    const color = findColor(this);
                    cache[url] = {color, date: Date.now()};
                    resolve(color);
                });
            });
    
            req.on('error', reject);
            req.end();
        });
    }
}
