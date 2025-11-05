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

const transformCardData = (items, collectionName) => {
    const itemList = items.map(item => {
        let correctCardType = item.card_type.toLowerCase();
        correctCardType[0] = item.card_type[0];

        const frontPower = item.card_type !== "Extra" ? Number(item.card_power) : null;
        const frontCombo = item.card_type === "Battle" ? Number(item.card_combo_power) : null;
        const frontCost = item.card_type !== "Leader" ? Number(item.card_energy_cost) : null;

        const data = {
            "id": item.card_number || "",
            "isToken": false,
            "face": {
                "front": {
                    "name": item.card_name || "",
                    "type": item.card_type,
                    "cost": frontCost,
                    "image": `https://nichobrando.github.io/Dragon-Ball-Fusion-Arena/${collectionName}/${item.card_number}.webp`,
                    "color": item.card_color,
                    "power": frontPower,
                    "combo": frontCombo,
                    "isHorizontal": false,
                    "traits": item.card_traits
                }
            },
            "name": item.card_name,
            "type": item.card_type,
            "cost": frontCost,
            "power": frontPower,
            "combo": frontCombo,
            "color": item.card_color
        };

        if (data.type === 'LEADER') {
            data.face.back = {
                "name": item.card_back_name || "",
                "type": item.card_type,
                "cost": null,
                "image": `https://nichobrando.github.io/Dragon-Ball-Fusion-Arena/${collectionName}/${item.card_number}-b.webp`,
                "color": item.card_back_color,
                "power": Number(item.card_back_power),
                "combo": null,
                "isHorizontal": false,
                "traits": item.card_back_traits
            }
        }

        return data;
    });

    return itemList;
}

module.exports = transformCardData;