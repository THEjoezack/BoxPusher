exports.build = function(rl, levelNumber) {
    this.rl = rl;
    var game = new rl.Game();
    game.entityCanSeeThrough = function() { return true; } // don't limit vision
    game.renderer.setCenter = function() {} // don't move "camera"

    var mapData = loadLevel(levelNumber);
    var level = {
        game: game,
        level: levelNumber,
        defaultType: 'nothing',
        charToType: charToType,
        map: mapData.map,
        startingPosition: mapData.startingPosition,
        boxes: mapData.boxes,
        buttons: mapData.buttons,
        completeMessage: mapData.completeMessage
    };

    this.rl.Tile.Types.button = require('./button').create();
    game.map.loadTilesFromArrayString(level.map, level.charToType, level.defaultType);

    // generate and assign a map object (replaces empty default)
    game.setMapSize(9, 9);

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

    $('#example-console-container').html('<div>' + mapData.startingMessage.join('</div><div>') +'</div>');

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
    if(levelNumber === 0) {
        result = {
            width: 9,
            height: 3,
            map: [
                '#########',
                '#@..H..X#',
                '#########'
            ],
            startingMessage: [
                'You are a little @',
                'You can push the little H onto the little X'
            ],
            completeMessage: [
                'Good job, now lets try something harder!'
            ]
        };
    } else if(levelNumber === 1) {
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
            ],
            startingMessage: [
                'Cover all of the X to advanced to the next level.',
                'Refresh the browser if you get stuck!'
            ],
            completeMessage: [
                'Wow, you\'re hard core. Now for a real challenge!'
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
            ],
            startingMessage: [
                'Good luck with this one, buddy.',
                'Refresh the browser after you lose if you\'d like to try again.'
            ],
            completeMessage: [
                'Well...you did it. You won everything!'
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
