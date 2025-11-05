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

const transformCardData = (items) => {
    const itemList = items.map(item => {
        item.card_type = item.card_type.charAt(0).toUpperCase() + item.card_type.slice(1).toLowerCase();

        const frontPower = item.card_type !== "Extra" ? Number(item.card_power) : null;
        const frontCombo = item.card_type === "Battle" ? Number(item.card_combo_power) : null;
        const frontCost = item.card_type !== "Leader" ? Number(item.card_energy_cost) : null;

        const collectionName = item.card_number.split('-')[0];

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
            "color": item.card_color,
            variants: (item.variants || []).map(curVariant => curVariant.card_number).filter(Boolean)
        };

        if (data.type === 'Leader') {
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

    const data = itemList.reduce((acc, curItem) => {
        if (curItem.variants || [].length) {
            return [
                ...acc,
                curItem,
                ...curItem.variants.map(curVariant => {
                    const collectionName = curVariant.split('-')[0];

                    const data = {
                        ...curItem,
                        id: curVariant,
                        face: {
                            front: {
                                ...curItem.face.front,
                                image: `https://nichobrando.github.io/Dragon-Ball-Fusion-Arena/${collectionName}/${curVariant}.webp`
                            }
                        }
                    };

                    if (data.type === 'Leader') {
                        data.face.back = {
                            ...curItem.face.back,
                            image: `https://nichobrando.github.io/Dragon-Ball-Fusion-Arena/${collectionName}/${curVariant}-b.webp`
                        }
                    }

                    return data;
                })
            ];
        }

        return [
            ...acc,
            curItem
        ]
    }, []);

    console.log(data);

    return data;
}

module.exports = transformCardData;