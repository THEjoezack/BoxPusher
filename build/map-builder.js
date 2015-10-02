(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1]);
