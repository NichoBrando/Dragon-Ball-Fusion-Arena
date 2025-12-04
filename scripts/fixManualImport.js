const fusionWorldCardList = require('../docs/fusionWorldCardList.json');
const manualAddCards = require('./manualAddCards.json');
const { writeFileSync } = require('fs');
const path = require('path');
const saveImageFromOfficialSite = require('./steps/saveImageFromOfficialSite');
const transformManualCardData = require('./steps/transformManualCardData');

const fixManualImport = async () => {
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

    const groupedCards = [ 
        ...manualAddCardsFormatted
    ].reduce(
        (acc, cardList) => ({
            ...acc,
            ...cardList
        }), fusionWorldCardList
    );

    await writeFileSync(path.join(__dirname, "..", "docs", "fusionWorldCardList.json"), JSON.stringify(groupedCards));
};

fixManualImport().then(() => {
    console.log("Done");
    process.exit(0);
});