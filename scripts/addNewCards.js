const collectionList = require('./collectionList.json');
const { writeFileSync, readFileSync } = require('fs');
const path = require('path');
const transformManualCardData = require('./steps/transformManualCardData');
const manualAddCards = require('./manualAddCards.json');

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

    console.log(cardListSerialized);

    console.log(Object.keys(manualAddCardsFormatted).length);

    console.log(manualAddCardsFormatted);

    manualAddCardsFormatted.forEach(item => {
        cardListSerialized[item.id] = item;
    });

    await writeFileSync(path.join(__dirname, "..", "docs", "fusionWorldCardList.json"), JSON.stringify(cardListSerialized));
};

generateCardList().then(() => {
    console.log("Done");
    process.exit(0);
});