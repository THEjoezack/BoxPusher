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
            'Level 1',
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
            'Level 2',
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
            'Level 3',
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
            'Level 4',
            'Be careful, there is no pulling so plan your moves!'
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
            'Final Level',
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
            'Level: Purgatory',
            'Yeah, there\'s no solution. You\'re stuck!'
        ],
        completeMessage: [
            'Well...you did it. You won everything!'
        ]
    }
];