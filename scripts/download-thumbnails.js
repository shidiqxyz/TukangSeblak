const fs = require('fs');
const path = require('path');
const https = require('https');

// This list matches initialCards.js
const THUMBNAILS = [
    'linea.jpg',
    'monad.jpg',
    'calculator.jpg',
    'resolv.jpg',
    'mcap.jpg',
    'anime.jpg',
    'nillion.jpg',
    'gensyn.jpg',
    'sss.jpg',
    'illustration.jpg',
    'base.jpg',
    '100s.jpg',
];

const DOWNLOAD_DIR = path.join(__dirname, '..', 'public', 'thumbnails');
const API_URL = 'https://api.waifu.pics/sfw/waifu';

// Ensure directory exists
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

async function downloadImage(filename) {
    const filePath = path.join(DOWNLOAD_DIR, filename);

    // Skip if file exists
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${filename} already exists. Skipping.`);
        return;
    }

    console.log(`⬇️  Downloading thumbnail for ${filename}...`);

    try {
        // 1. Get Image URL from API
        const imageUrl = await new Promise((resolve, reject) => {
            const options = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            };

            https.get(API_URL, options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.url) {
                            resolve(json.url);
                        } else {
                            reject(new Error(`Invalid API response: ${data.substring(0, 100)}`));
                        }
                    } catch (e) {
                        reject(new Error(`Failed to parse API JSON: ${data.substring(0, 100)}`));
                    }
                });
                res.on('error', reject);
            }).on('error', reject);
        });

        // 2. Download the image file
        await new Promise((resolve, reject) => {
            const options = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            };

            https.get(imageUrl, options, (res) => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Failed to download image: ${res.statusCode}`));
                    return;
                }

                const fileStream = fs.createWriteStream(filePath);
                res.pipe(fileStream);

                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`✨ Saved ${filename}`);
                    resolve();
                });

                fileStream.on('error', (err) => {
                    fs.unlink(filePath, () => { }); // Delete partial file
                    reject(err);
                });
            }).on('error', reject);
        });

    } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error.message);
    }
}

async function main() {
    console.log('🚀 Starting thumbnail download...');

    for (const filename of THUMBNAILS) {
        await downloadImage(filename);
        // Add small delay to be polite
        await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n🎉 All operations completed!');
}

main();
