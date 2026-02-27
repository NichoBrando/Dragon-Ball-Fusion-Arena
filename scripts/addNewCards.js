const collectionList = require('./collectionList.json');
const { writeFileSync, readFileSync } = require('fs');
const path = require('path');
const transformManualCardData = require('./steps/transformManualCardData');
const manualAddCards = require('./manualAddCards.json');
const markers = require('./markers.json');
const saveImage = require('./steps/saveImage');

const generateCardList = async () => {
    const manualAddCardsFormatted = await (async () => {
        const cards = transformManualCardData(manualAddCards);

        return cards
            .map(item => ({
                    ...item,
                    face: {
                        front: {
                            ...item.face.front,
                            urlImage: undefined
                        },
                        back: item.face.back ? {
                            ...item.face.back,
                            urlImage: undefined
                        } : undefined
                    }
            }));
    })();

    const curCardListStr = await readFileSync(path.join(__dirname, "..", "docs", "fusionWorldCardList.json"));

    const cardListSerialized = JSON.parse(curCardListStr);

    manualAddCardsFormatted.forEach(item => {
        cardListSerialized[item.id] = item;
    });

    const transformedMarkers = markers.map(item => {
        const name = (item.code).split('_')[0] + " Energy Marker";
        
        return ({
            "id": item.code,
            "isToken": true,
            "face": {
                "front": {
                    name,
                    "type": "Energy Marker",
                    "cost": null,
                    "image": item.image,
                    "isHorizontal": false
                }
            },
            name,
            "type": "Energy Marker",
            "cost": null,
            tokens: [item.code]
        })
    });

    await saveImage(transformedMarkers);

    transformedMarkers.forEach(item => {
        cardListSerialized[item.id] = {
            ...item,
            face: {
                front: {
                    ...item,
                    image: `https://nichobrando.github.io/Dragon-Ball-Fusion-Arena/${item.id.split('-')[0]}/${item.id}.webp`
                }
            }
        };
    });

    await writeFileSync(path.join(__dirname, "..", "docs", "fusionWorldCardList.json"), JSON.stringify(cardListSerialized));
};

generateCardList().then(() => {
    console.log("Done");
    process.exit(0);
});