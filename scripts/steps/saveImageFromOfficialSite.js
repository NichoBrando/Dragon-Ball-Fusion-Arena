const fs = require('fs');
const path = require('path');
const collectionList = require('../collectionList.json');
const { parallel } = require('radash');

const saveImageFromOfficialSite = async (items) => {
    const dir = path.join(__dirname, "..", "..", "docs");
    
    // Create folders for each collection
    for (const folder of collectionList) {
        let dirWithFile = path.join(dir, folder);
        if (!fs.existsSync(dirWithFile)) {
            fs.mkdirSync(dirWithFile, { recursive: true });
            console.log(`Created directory: ${dirWithFile}`);
        }
    }

    const cardsToDownload = items.reduce((acc, curItem) => {
        if (curItem.type === "Leader") {
            return [
                ...acc,
                curItem,
                {
                    ...curItem,
                    isBackSide: true
                }
            ]
        }

        return [
            ...acc,
            curItem
        ];
    }, []);

    const cardsToIgnore = [];

    await parallel(5, cardsToDownload, async (card) => {
        const collection = card.id.split('-')[0];
        const filePath = path.join(dir, collection, `${card.id}${card.isBackSide ? '-b' : ''}.webp`).replace('_f', '');
        if (!fs.existsSync(filePath)) {
            try {
                const url = card.isBackSide ? card.face.back.urlImage : card.face.front.urlImage;
                console.log(url);
                const response = await fetch(url);
                if (!response.ok) {
                    cardsToIgnore.push(card.id);
                    throw new Error(`Failed to fetch image: ${url}`);
                }
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
    });

    return cardsToIgnore;
};

module.exports = saveImageFromOfficialSite;