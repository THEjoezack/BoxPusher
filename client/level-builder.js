// responsible for generating the level
exports.getLevel = function(game, levelNumber) {
    var levels = require('./config').levels;
    var index = Math.min(levels.length - 1, levelNumber);
    var mapData = jQuery.extend(true, {}, levels[index]);
    mapData.boxes = [];
    mapData.buttons = [];

    var map = mapData.map;
    for(var y = 0; y < map.length; y++) {
        for(var x = 0; x < map[y].length; x++) {
            if(map[y][x] === '@') {
                mapData.startingPosition = { x: x, y: y };
                map[y] = swap(map[y], x);
            }
            if(map[y][x] === 'H') {
                mapData.boxes.push({ x: x, y: y});
                map[y] = swap(map[y], x);
            }
            if(map[y][x] === 'X') {
                mapData.buttons.push({ x: x, y: y});
            }
        }
    }

    game.map.loadTilesFromArrayString(map, require('./config').charToTypes, 'nothing');
    game.setMapSize(map[0].length, map.length);

    return {
        game: game,
        map: mapData.map,
        startingPosition: mapData.startingPosition,
        boxes: mapData.boxes,
        buttons: mapData.buttons,
        startingMessage: mapData.startingMessage,
        completeMessage: mapData.completeMessage
    };
};

function swap(s, index) {
    return s.substr(0, index) + '.' + s.substr(index + 1);
}
