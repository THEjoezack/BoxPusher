exports.create = function(game) {
    return {
        name: 'Button',
        char: 'X',
        color: '#CC0000',
        bgColor: '#CCCCCC',
        passable: true,
        onEntityEnter: function(entity) {
            debugger;
            console.log(entity);
        }
    };
};