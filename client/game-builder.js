// responsible for generating the game
exports.build = function(rl, levelNumber) {
    var game = new rl.Game();
    rl.Tile.Types.button = require('./button').create();
    rl.Entity.Types.box = require('./box').create(game);

    var level = require('./level-builder').getLevel(game, levelNumber);

    addBoxes(level, rl);
    addPlayer(level);

    game.renderer.layers = [
        new rl.RendererLayer(game, 'map',      {draw: false, mergeWithPrevLayer: false}),
        new rl.RendererLayer(game, 'entity',   {draw: true,  mergeWithPrevLayer: true}),
        new rl.RendererLayer(game, 'lighting', {draw: true,  mergeWithPrevLayer: false}),
        new rl.RendererLayer(game, 'fov',      {draw: false, mergeWithPrevLayer: false})
    ];
    game.input.addBindings(require('./config').keyBindings);
    game.entityCanSeeThrough = function() { return true; }; // don't limit vision
    game.renderer.setCenter = function() {}; // don't move "camera"
    game.renderer.resize(level.map[0].length, level.map.length);
    game.start();

    return level;
};

function addBoxes(level, rl) {
    var game = level.game;
    for (var i = 0; i < level.boxes.length; i++) {
        var position = level.boxes[i];
        var item = new rl.Entity(game, 'box');
        game.entityManager.add(position.x, position.y, item);
    }
}

function addPlayer(level) {
    level.game.player.x = level.startingPosition.x;
    level.game.player.y = level.startingPosition.y;
}