const getCollection = async () => {
    const cardList = [];

    let currentResponse = [];
    let currentPage = 1;

    do {
        const request = await  fetch(
            `https://api.deckplanet.net/cardsearch/fusion_world_cards?filter={%22_and%22:[{%22status%22:{%22_eq%22:%22published%22}},{%22variant_of%22:{%22id%22:{%22_null%22:true}}}]}&page=${currentPage}&search=&deep={%22variants%22:{%22_limit%22:-1,%22_sort%22:%22card_number%22,%22_filter%22:{%22status%22:{%22_eq%22:%22published%22}}}}&sort=-&isExactSearch=undefined`
        );

        if (!request.ok) {
            throw new Error(`HTTP error! status: ${request.status}`);
        }

        const response = await request.json();

        if (!response?.data) {
            throw new Error('Invalid response data');
        }

        currentResponse = response.data;
        currentPage++;
        
        const formattedCards = currentResponse;

        if (formattedCards.length) {
            cardList.push(...formattedCards);
        };
    } while (currentResponse.length > 0 && currentResponse.length >= 50);

    return cardList;
};

module.exports = getCollection;