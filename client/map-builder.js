var charToType = {
    '#': 'wall',
    '.': 'floor',
    'X': 'button',
    'H': 'box'
};

function swap(s, index) {
    return s.substr(0, index) + '.' + s.substr(index + 1);
}

function loadLevel() {
    var result = {
        width: 9,
        height: 9,
        map: [
            '#####    ',
            '#@..#    ',
            '#.HH# ###',
            '#.H.# #X#',
            '###.###X#',
            ' ##....X#',
            ' #...#..#',
            ' #...####',
            ' ##### '
        ]
    };

    var map = result.map;
    result.boxes = [];
    result.buttons = [];
    for(var y = 0; y < map.length; y++) {
        for(var x = 0; x < map[y].length; x++) {
            if(map[y][x] === '@') {
                result.startingPosition = { x: x, y: y };
                map[y] = swap(map[y], x);
            }
            if(map[y][x] === 'H') {
                result.boxes.push({ x: x, y: y});
                map[y] = swap(map[y], x);
            }
            if(map[y][x] === 'X') {
                result.buttons.push({ x: x, y: y});
            }
        }
    }
    return result;
}

exports.build = function(levelNumber) {
    var level = loadLevel(level);
    return {
        level: levelNumber,
        defaultType: 'nothing',
        charToType: charToType,
        map: level.map,
        startingPosition: level.startingPosition,
        boxes: level.boxes,
        buttons: level.buttons
    };
};
