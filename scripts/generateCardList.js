const { parallel } = require('radash');
const collectionList = require('./collectionList.json');
const transformCardData = require('./steps/transformCardData');
const { writeFileSync } = require('fs');
const path = require('path');
const saveImage = require('./steps/saveImage');
const getCollection = require('./steps/getCollection');

const generateCardList = async () => {
    const cardLists = await parallel(
        4, 
        collectionList,
        async collectionName => {
            const cards = await getCollection(collectionName);

            const treatedCards = transformCardData(cards);
            
            await saveImage(treatedCards);

            const data = treatedCards.reduce((acc, item) => ({
                ...acc,
                [item.id]: item
            }), {});

            return data;
        }
    );

    // add energy marker scrapper

    const groupedCards = cardLists.reduce((acc, cardList) => {
        return {
            ...acc,
            ...cardList
        };
    }, {});

    await writeFileSync(path.join(__dirname, "..", "docs", "fusionWorldCardList.json"), JSON.stringify(groupedCards));
};

generateCardList().then(() => {
    console.log("Done");
    process.exit(0);
});