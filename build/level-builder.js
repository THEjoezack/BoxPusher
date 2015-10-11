(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.keyBindings = {
    up: ['UP_ARROW', 'K', 'W'],
    down: ['DOWN_ARROW', 'J', 'S'],
    left: ['LEFT_ARROW', 'H', 'A'],
    right: ['RIGHT_ARROW', 'L', 'D']
};

exports.charToTypes = {
    '#': 'wall',
    '.': 'floor',
    'X': 'button',
    'H': 'box'
};

exports.levels = [
    {
        map: [
            '#########',
            '#@..H..X#',
            '#########'
        ],
        startingMessage: [
            'You are a little <span class="player">@</span>',
            'You can push the <span class="box">H</span> onto the <span class="button">X</span>',
            'Use the W,A,S,D or arrow keys to move'
        ],
        completeMessage: [
            'Good job, now lets try something harder!'
        ]
    },{
        map: [
            '   ###   ',
            '   #X#   ',
            '   #.#   ',
            '####H####',
            '#@...H.X#',
            '####H####',
            '   #.#   ',
            '   #X#   ',
            '   ###   '
        ],
        startingMessage: [
            'There are three <span class="button">X</span> in this level',
            'Cover each of them with a <span class="box">H</span> to progress'
        ],
        completeMessage: [
            'Good job, now lets try something harder!'
        ]
    },{
        map: [
            '#########',
            '#.......#',
            '#......H#',
            '#....##.#',
            '#@...HHX#',
            '#########'
        ],
        startingMessage: [
            'You can\'t push more than one <span class="box">H</span> at a time',
            'Cover each of them with a <span class="box">H</span> to progress'
        ],
        completeMessage: [
            'Good job, now lets try something harder!'
        ]
    },{
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
        ],
        startingMessage: [
            'Be careful, there are no take backsies so plan your moves!'
        ],
        completeMessage: [
            'Wow, you\'re hard core. Now for a real challenge!'
        ]
    },{
        map: [
            '#########',
            '#X.H.H.X#',
            '#..H.H..#',
            '#..H.H..#',
            '#@.H.H..#',
            '#..H.H..#',
            '#..H.H..#',
            '#X.H.H.X#',
            '#########'
        ],
        startingMessage: [
            'Good luck with this one, buddy.',
            'Refresh the browser after you lose if you\'d like to try again.'
        ],
        completeMessage: [
            'Well...you did it. You won everything!'
        ]
    },{
        map: [
            '#########',
            '#.......#',
            '#.......#',
            '#..HHH..#',
            '#@.HHH..#',
            '#..HHH..#',
            '#.......#',
            '#.......#',
            '#########'
        ],
        startingMessage: [
            'Yeah, there\'s no solution. You\'re stuck!'
        ],
        completeMessage: [
            'Well...you did it. You won everything!'
        ]
    }
];
},{}],2:[function(require,module,exports){
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

},{"./config":1}]},{},[2]);
