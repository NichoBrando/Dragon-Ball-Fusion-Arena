const fs = require('fs');
const path = require('path');
const collectionList = require('../collectionList.json');

const saveImage = async (items) => {
    const dir = path.join(__dirname, "..", "..", "public");
    
    // Create folders for each collection
    for (const folder of collectionList) {
        let dirWithFile = path.join(dir, folder);
        if (!fs.existsSync(dirWithFile)) {
            fs.mkdirSync(dirWithFile, { recursive: true });
            console.log(`Created directory: ${dirWithFile}`);
        }
    }

    // Download images
    for (const card of items) {
        const collection = card.id.split('-')[0];
        const filePath = path.join(dir, collection, `${card.id}.${card.isToken ? 'webp' : 'webp'}`);
        if (!fs.existsSync(filePath)) {
            try {
                const response = await fetch(`https://multi-deckplanet.us-southeast-1.linodeobjects.com/fusion_world/${card.id}.webp`);
                if (!response.ok) throw new Error(`Failed to fetch image: ${card.imageUrl}`);
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                fs.writeFileSync(filePath, buffer);
                console.log(`Downloaded image: ${filePath}`);
            } catch (error) {
                console.error(`Error downloading image for ${card.name}:`, error);
            }
        } else {
            console.log(`Image already exists: ${filePath}`);
        }
    }
};

module.exports = saveImage;