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