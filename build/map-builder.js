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
exports.create = function() {
    return {
        name: 'Button',
        char: 'X',
        color: '#CC0000',
        bgColor: '#CCCCCC',
        passable: true,
        blocksLos: false
    };
};
},{}],3:[function(require,module,exports){
exports.build = function(rl, levelNumber) {
    this.rl = rl;
    var game = new rl.Game();
    game.entityCanSeeThrough = function() { return true; }

    var mapData = loadLevel(levelNumber);
    var level = {
        game: game,
        level: levelNumber,
        defaultType: 'nothing',
        charToType: charToType,
        map: mapData.map,
        startingPosition: mapData.startingPosition,
        boxes: mapData.boxes,
        buttons: mapData.buttons
    };

    this.rl.Tile.Types.button = require('./button').create();
    game.map.loadTilesFromArrayString(level.map, level.charToType, level.defaultType);

    // generate and assign a map object (replaces empty default)
    game.setMapSize(game.map.width, game.map.height);

    // add input keybindings
    game.input.addBindings({
        up: ['UP_ARROW', 'K', 'W'],
        down: ['DOWN_ARROW', 'J', 'S'],
        left: ['LEFT_ARROW', 'H', 'A'],
        right: ['RIGHT_ARROW', 'L', 'D']
    });

    // create entities and add to game.entityManager
    function addEntity(entity, items) {
        for(var i = 0; i < items.length; i++) {
            var position = items[i];
            var item = new rl.Entity(game, entity);
            game.entityManager.add(position.x, position.y, item);
        }
    }
    this.rl.Entity.Types.box = require('./box').create(game);
    addEntity('box', level.boxes);

    game.player.x = level.startingPosition.x;
    game.player.y = level.startingPosition.y;
    game.renderer.layers = [
        new rl.RendererLayer(game, 'map',       {draw: false,   mergeWithPrevLayer: false}),
        new rl.RendererLayer(game, 'entity',    {draw: true,   mergeWithPrevLayer: true}),
        new rl.RendererLayer(game, 'lighting',  {draw: true,    mergeWithPrevLayer: false}),
        new rl.RendererLayer(game, 'fov',       {draw: false,    mergeWithPrevLayer: false}),
    ];
    game.start();

    return level;
};

var charToType = {
    '#': 'wall',
    '.': 'floor',
    'X': 'button',
    'H': 'box'
};

function swap(s, index) {
    return s.substr(0, index) + '.' + s.substr(index + 1);
}

function loadLevel(levelNumber) {
    var result;
    if(levelNumber % 2 === 0) {
        result = {
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
    } else {
        result = {
            width: 9,
            height: 9,
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
            ]
        };
    }

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

},{"./box":1,"./button":2}],4:[function(require,module,exports){
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

},{}]},{},[3]);
