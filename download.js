const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, 'client', 'public', 'images');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const images = {
    'Thin Crust': 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg',
    'Wheat Base': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Spinach_pizza.jpg',
    'Cheese Burst': 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Pepperoni_pizza.jpg',
    'Classic Base': 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg',
    'Stuffed Crust': 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg',
    'Tomato': 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg',
    'BBQ': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Barbecue_sauce.jpg',
    'Pesto': 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Pesto.jpg',
    'Spicy': 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Sriracha.jpg',
    'Garlic': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Garlic_Plait.jpg',
    'Mozzarella': 'https://upload.wikimedia.org/wikipedia/commons/8/89/Mozzarella_di_bufala_campana.jpg',
    'Cheddar': 'https://upload.wikimedia.org/wikipedia/commons/1/18/Somerset-Cheddar.jpg',
    'Parmesan': 'https://upload.wikimedia.org/wikipedia/commons/3/30/Parmigiano_reggiano_piece.jpg',
    'Onion': 'https://upload.wikimedia.org/wikipedia/commons/2/25/Onion_on_White.JPG',
    'Capsicum': 'https://upload.wikimedia.org/wikipedia/commons/d/de/Red_capsicum.jpg',
    'Corn': 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Corncob.jpg',
    'Mushroom': 'https://upload.wikimedia.org/wikipedia/commons/0/01/ChampignonMushroom.jpg',
    'Olives': 'https://upload.wikimedia.org/wikipedia/commons/4/43/Olives_from_the_market.jpg',
    'Jalapeno': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Jalapeno_peppers.jpg'
};

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };
        https.get(url, options, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            } else if (response.statusCode === 301 || response.statusCode === 302) {
                download(response.headers.location, dest).then(resolve).catch(reject);
            } else {
                reject(`Failed to download ${url} - Status: ${response.statusCode}`);
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err.message);
        });
    });
};

async function downloadAll() {
    for (const [name, url] of Object.entries(images)) {
        const filename = name.replace(/ /g, '_').toLowerCase() + '.jpg';
        const dest = path.join(dir, filename);
        try {
            await download(url, dest);
            console.log(`Downloaded ${filename}`);
            // Wait 500ms to avoid rate limits
            await new Promise(r => setTimeout(r, 500));
        } catch (err) {
            console.error(`Error downloading ${name}:`, err);
        }
    }
}

downloadAll();
