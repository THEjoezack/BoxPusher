(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.create = function(game) {
    return {
        name: 'Box',
        char: 'H',
        color: '#FF8000',
        bgColor: '#663300',
        bump: function(entity){
            var observer = require("node-observer");

            // bumping entity is the player
            if(entity === game.player){
                var pusherX = entity.x,
                    pusherY = entity.y,
                    directionX = this.x - pusherX,
                    directionY = this.y - pusherY,
                    targetX = this.x + directionX,
                    targetY = this.y + directionY;

                // check if can be pushed into destination
                var targetPushEnt = game.entityManager.get(targetX, targetY);
                if(!targetPushEnt || targetPushEnt.passable){
                    var targetPushTile = game.map.get(targetX, targetY);
                    if(targetPushTile.passable){
                        var prevX = this.x,
                            prevY = this.y;

                        observer.send(this, 'pushSuccess', targetPushEnt);

                        // push target entity into tile
                        this.moveTo(targetX, targetY);

                        // move player into previously occupied tile
                        entity.moveTo(prevX, prevY);

                        if(targetPushTile.type === "button") {
                            observer.send(this, 'buttonCovered', targetPushTile);
                        }

                        return true;
                    } else {
                        observer.send(this, 'pushFailed', targetPushEnt);
                    }
                }
            }
            return false;
        },
        onEntityEnter: function(entity) {
            console.log(entity);
        }
    };
};
},{"node-observer":4}],2:[function(require,module,exports){
// entities
var box = require('./box');
var observer = require("node-observer");

//var button = require('./button');

/*globals RL*/
var rl = RL;

rl.Tile.Types.button = {
    name: 'Button',
    char: 'X',
    color: '#CC0000',
    bgColor: '#CCCCCC',
    passable: true,
    blocksLos: false
};

var game = new rl.Game();
game.entityCanSeeThrough = function() { return true; }

var keyBindings = {
    up: ['UP_ARROW', 'K', 'W'],
    down: ['DOWN_ARROW', 'J', 'S'],
    left: ['LEFT_ARROW', 'H', 'A'],
    right: ['RIGHT_ARROW', 'L', 'D']
};

var mapBuilder = require('./map-builder');
var level = mapBuilder.build(1);
game.map.loadTilesFromArrayString(level.map, level.charToType, level.defaultType);

// generate and assign a map object (replaces empty default)
game.setMapSize(game.map.width, game.map.height);

// add input keybindings
game.input.addBindings(keyBindings);

// create entities and add to game.entityManager
function addEntity(entity, items) {
    for(var i = 0; i < items.length; i++) {
        var position = items[i];
        var item = new rl.Entity(game, entity);
        game.entityManager.add(position.x, position.y, item);
    }
}

// add entities
rl.Entity.Types.box = box.create(game);
addEntity('box', level.boxes);
for(var i = 0; i < level.boxes; i++) {
    var position = level.boxes[i];
    game.map.get(position.x, position.y).onEntityEnter = function() {
    }
}

game.map.get(0,0).onEntityEnter

game.player.x = level.startingPosition.x;
game.player.y = level.startingPosition.x;

// make the view a little smaller
//game.renderer.resize(20, 20);

// get existing DOM elements
var document = window.document;
var mapContainerEl = document.getElementById('example-map-container');
var consoleContainerEl = document.getElementById('example-console-container');

// append elements created by the game to the DOM
mapContainerEl.appendChild(game.renderer.canvas);
//consoleContainerEl.appendChild(game.console.el);

game.renderer.layers = [
    new rl.RendererLayer(game, 'map',       {draw: false,   mergeWithPrevLayer: false}),
    new rl.RendererLayer(game, 'entity',    {draw: true,   mergeWithPrevLayer: true}),
    //new rl.RendererLayer(game, 'lighting',  {draw: true,    mergeWithPrevLayer: false}),
    new rl.RendererLayer(game, 'fov',       {draw: false,    mergeWithPrevLayer: false}),
];

//game.console.log('The game starts.');

observer.subscribe(this, 'pushSuccess', function(who, data) {
    //console.log('pushSuccess;')
});

observer.subscribe(this, 'pushFailed', function(who, data) {
    //console.log('pushFailed;')
});
observer.subscribe(this, 'buttonCovered', function(who, coveredButton) {
    function isCovered(position) {
        var entities = game.entityManager.objects;
        for(var i = 0; i < entities.length; i++) {
            if(entities[i].type === 'box' && entities[i].x === position.x && entities[i].y === position.y) {
                return true;
            }
        }
        return false;
    }

    for(var i = 0; i < level.buttons.length; i++) {
        var position = level.buttons[i];
        if(position.x == coveredButton.x && position.y == coveredButton.y) {
            continue;
        }
        if(isCovered(position)) {
            continue;
        }
        return;
    }
    observer.send(this, 'levelComplete');
});

observer.subscribe(this, 'levelComplete', function(who, data) {
    alert('you did it! onto the next level (eventually)');
});

// start the game
game.start();
},{"./box":1,"./map-builder":3,"node-observer":4}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
"use strict";

var Observer = function() {
  	this.subscriber = [];
};

Observer.prototype.subscribe = function(who, what, cb) {
	if (!this.subscriber[what]) {
		this.subscriber[what] = [];
	}

	for(var i = 0; i < this.subscriber[what].length; i++) {
		var o = this.subscriber[what][i];
		if (o.item == who && o.callback == cb) {
			return;
		}
	}

	this.subscriber[what].push({item: who, callback: cb });	
};

Observer.prototype.unsubscribe = function(who, what) {
	if (!this.subscriber[what]) return;

	for(var i = 0; i < this.subscriber[what].length; i++) {
		var o = this.subscriber[what][i];
		if (o.item == who) {
			this.subscriber[what].splice(i, 1);
			return;
		}
	}

};

Observer.prototype.send = function(who, what, data) {
	if (!this.subscriber[what]) return;

	for(var i = 0; i < this.subscriber[what].length; i++) {
		var o = this.subscriber[what][i];
		o.callback(who, data);
	}
};

module.exports = new Observer();

},{}]},{},[2]);
