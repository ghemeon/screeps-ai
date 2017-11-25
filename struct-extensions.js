const Errors = require('errors');
const utils = require('utils');
const Constants = require('constants');

StructExtensions = {
    getDesiredNumberOfStructs: function(room) {
        let lvl = room.controller.level,
            info = Constants.RoomLevel[lvl],
            num = info.extensions;
        return num || 0;

    },
    getDesiredRange: function (room) {
        let lvl = room.controller.level,
            info = Constants.RoomLevel[lvl],
            num = info.extensions;
        return num || 5;
    },
    buildInRoom: function (room) {
        console.log('Creating Extensions in ' + room)
        let sources = room.find(FIND_SOURCES),
            existingExt = room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }}),
            existingSites = room.find(FIND_MY_CONSTRUCTION_SITES, {filter: { structureType: STRUCTURE_EXTENSION }}),
            existing = existingExt.length + existingSites.length,
            desired = this.getDesiredNumberOfStructs(room),
            howmany = desired - existingExt.length - existingSites.length,
            range = this.getDesiredRange(room);

        
        //console.log(`${howmany} = ${desired} - ${existingExt.length} - ${existingSites.length}`);
        if(howmany < 1) {
            console.log('No Extensions to create. Already enough.')
            return;
        }

        //round robin, build extensions
        for(i=0;i<sources.length;i++) {
            let posList = utils.findFreePosNearby(sources[i], 5, howmany);
            
            while(posList.length && howmany-- > 0) {
                let pos = posList.pop();
                console.log('Creating Extension at ' +pos)
                code = room.createConstructionSite(pos, STRUCTURE_EXTENSION);
                Errors.check(room, 'createConstructionSite', code);
                if (code !== OK) howmany++;
            }
        }
    }
};
module.exports = StructExtensions;