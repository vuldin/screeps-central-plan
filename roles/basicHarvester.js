var roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    creep.memory.role = 'harvester'
    if(creep.carry.energy < creep.carryCapacity) {
      let harvestTargets = creep.room.find(FIND_SOURCES)
      harvestTargets.sort( (a,b) => a.energy - b.energy)
      if(creep.harvest(harvestTargets[1]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(harvestTargets[1])
      }
    }
    else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
            structure.energy < structure.energyCapacity
        }
      })
      if(targets.length > 0) {
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0])
        }
      }
    }
  }
}

module.exports = roleHarvester
