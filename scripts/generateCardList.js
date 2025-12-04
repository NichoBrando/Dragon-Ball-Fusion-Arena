const { parallel } = require('radash');
const collectionList = require('./collectionList.json');
const markers = require('./markers.json');
const manualAddCards = require('./manualAddCards.json');
const transformCardData = require('./steps/transformCardData');
const { writeFileSync } = require('fs');
const path = require('path');
const saveImage = require('./steps/saveImage');
const getCollection = require('./steps/getCollection');
const saveImageFromOfficialSite = require('./steps/saveImageFromOfficialSite');
const transformManualCardData = require('./steps/transformManualCardData');

const generateCardList = async () => {
    const manualAddCardsFormatted = await (async () => {
        const cards = transformManualCardData(manualAddCards);

        const cardsToIgnore = await saveImageFromOfficialSite(cards);

        return cards
            .filter(item => !cardsToIgnore.includes(item.id))
            .map(item => ({
                [item.id]: ({
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
                })
            }));
    })();

    const cardLists = await (async () => {
        const cards = await getCollection();

        const treatedCards = transformCardData(cards);
        
        const cardsToIgnore = await saveImage(treatedCards);


        return treatedCards
            .filter(item => !cardsToIgnore.includes(item.id))
            .map(item => ({
                [item.id]: ({
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
                })
            }));
    })();

    console.log(Object.keys(cardLists).length);

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
        ...cardLists, 
        ...markerCollection,
        ...manualAddCardsFormatted
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