const { parallel } = require('radash');
const collectionList = require('./collectionList.json');
const markers = require('./markers.json');
const manualAddCards = require('./manualAddCards.json');
const transformCardData = require('./steps/transformCardData');
const { writeFileSync } = require('fs');
const path = require('path');
const saveImage = require('./steps/saveImage');
const getCollection = require('./steps/getCollection');

const generateCardList = async () => {
    const cardLists = await (async () => {
        const cards = await getCollection();

        const treatedCards = transformCardData(cards);
        
        await saveImage(treatedCards);

        const data = treatedCards.reduce((acc, item) => ({
            ...acc,
            [item.id]: item
        }), {});

        return data;
    })();

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

    const markerCollection = transformedMarkers.map(item => ({
        [item.id]: {
            ...item,
            face: {
                front: {
                    ...item,
                    image: `https://nichobrando.github.io/Dragon-Ball-Fusion-Arena/${item.id.split('-')[0]}/${item.id}.webp`
                }
            }
        }
    }));

    const groupedCards = [
        ...manualAddCards, 
        [cardLists], 
        ...markerCollection
    ].reduce(
        (acc, cardList) => ({
            ...acc,
            ...cardList
        }), {}
    );

    await writeFileSync(path.join(__dirname, "..", "docs", "fusionWorldCardList.json"), JSON.stringify(groupedCards));
};

generateCardList().then(() => {
    console.log("Done");
    process.exit(0);
});