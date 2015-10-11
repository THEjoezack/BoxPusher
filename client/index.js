var levelNumber = 0;
var level = startLevel(levelNumber);

var observer = require("node-observer");
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
    level.game.input.stopListening();

    var message = '';
    for(var m = 0; m < level.completeMessage.length; m++) {
        message = message + '<p>' + level.completeMessage[m] + '</p>';
    }
    message = message + '<p>Tap a key to continue</p>';

    var modal = $('#modal');
    var shown = true;
    modal.find('.modal-content').html(message);
    modal.keyup(function() {
        modal.modal('hide');
    });
    modal.modal();
    modal.on('hidden.bs.modal', function () {
        if(shown) {
            shown = !shown;
            levelNumber = levelNumber + 1;
            level = startLevel(levelNumber);
        }
    })
});


function startLevel(levelNumber) {
    /*globals RL*/
    var rl = RL;
    var mapContainerEl = $('#example-map-container');
    var console = $('#example-console-container');
    console.hide();
    mapContainerEl.hide();
    var level = require('./game-builder').build(RL, levelNumber);
    mapContainerEl.html(level.game.renderer.canvas);
    console.html('<div>' + level.startingMessage.join('</div><div>') +'</div>');
    mapContainerEl.html(level.game.renderer.canvas);
    mapContainerEl.show();
    console.show();
    return level;
}

$('#resetButton').on('click', function() {
    level.game.input.stopListening();
    level = startLevel(levelNumber);
});