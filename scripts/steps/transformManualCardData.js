const desiredResponse = {
    "OGN-162a": {
        "id": "OGN-162a",
        "isToken": false,
        "face": {
        "front": {
            "name": "Miss Fortune, Captain",
            "type": "Unit",
            "cost": 5,
            "image": "",
            "isHorizontal": false
        }
        },
        "name": "Miss Fortune, Captain",
        "type": "Unit",
        "cost": 5,
        "Domain": [
            "🟠 Body"
        ]
    }
}

const transformManualCardData = (items) => {        
    return items.map(item => {
        const collectionName = item.code.split('-')[0];

        const data = {
            "id": item.code,
            "isToken": false,
            "face": {
                "front": {
                    name: item.cardName,
                    "type": item.type,
                    "cost": item.cost,
                    "image": `https://nichobrando.github.io/Dragon-Ball-Fusion-Arena/${collectionName}/${item.code}.webp`.replace('_f_', ''),
                    "urlImage": item.image,
                    "isHorizontal": false,
                    "power": item.power !== null ? Number(item.power) : null,
                    "combo": item.combo !== null ? Number(item.combo) : null,
                    "traits": item.traits || null
                }
            },
            name: item.cardName,
            "type": item.type,
            "cost": item.cost,
        };

        if (data.type === 'Leader') {
            data.face.back = {
                name: item.cardName,
                "type": item.type,
                "cost": item.cost,
                "image": `https://nichobrando.github.io/Dragon-Ball-Fusion-Arena/${collectionName}/${item.code}-b.webp`.replace('_f_', ''),
                "urlImage": item.image.replace('_f', '_b'),
                "isHorizontal": false,
                "power": item.awakenedPower !== null ? Number(item.awakenedPower) : null,
                "traits": item.traits || null
            };
        }

        return data;
    });
}

module.exports = transformManualCardData;