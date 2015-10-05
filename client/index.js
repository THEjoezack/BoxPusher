/*globals RL*/
var levelNumber = 0;
var level = require('./map-builder').build(RL, levelNumber);

// get existing DOM elements
var document = window.document;
var mapContainerEl = document.getElementById('example-map-container');
mapContainerEl.appendChild(level.game.renderer.canvas);
//var consoleContainerEl = document.getElementById('example-console-container');
//consoleContainerEl.appendChild(level.game.console.el);

var observer = require("node-observer");
observer.subscriber = [];
observer.subscribe(this, 'buttonCovered', function(who, coveredButton) {
    function isCovered(position) {
        var entities = level.game.entityManager.objects;
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
    $('#modal .modal-content').html('You did it, now do it again!');
    $('#modal').modal();

    levelNumber = levelNumber + 1;
    level = require('./map-builder').build(RL, levelNumber);
    mapContainerEl.innerHTML = '';
    mapContainerEl.appendChild(level.game.renderer.canvas);
});