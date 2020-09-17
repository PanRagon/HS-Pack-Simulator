const fs = require('fs');

const updateJsonArray = (element, path) => {
    let arr = fs.readFileSync(path, "utf8");
    arr = JSON.parse(arr);
    arr.push(element);
    let json = JSON.stringify(arr);
    fs.writeFileSync(path, json, 'utf8');
};

/*const updateJsonElement = (element, path) => {
        let jsonArr = require(path);

        for (var i = 0; i < jsonArr.length; i++) {
            if (jsonArr[i].id === element.id) {
                jsonArr[i] = element;
            }
        }
        jsonArr = JSON.stringify(jsonArr);
        fs.writeFileSync(path, jsonArr, 'utf8');
    };
*/
const updateJsonElements = (id, elements, path) => {
    let arr = fs.readFileSync(path, "utf8");
    arr = JSON.parse(arr);
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
            Object.keys(elements).forEach((el) => {
                arr[i][el] = elements[el]
            })
        }
    }
    let json = JSON.stringify(arr);
    fs.writeFileSync(path, json, "utf8");
};

const initializeJson = (map, path) => {
    if(fs.existsSync(path)) {

    } else {
        fs.writeFileSync(path, JSON.stringify([]));
    }

    try {
        let json = require(path);

        //If the JSON-file doesn't contain an array, calling forEach on it won't work.
        if(Array.isArray(json)) {
            json.forEach((el) => {
                map.set(el.id, el);
            });
        }
    } catch(e) {
        console.log("Users file is empty or does not exist.");
    }




};

module.exports = { updateJsonArray, updateJsonElements, initializeJson };