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
},{"node-observer":2}],2:[function(require,module,exports){
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

},{}]},{},[1]);
