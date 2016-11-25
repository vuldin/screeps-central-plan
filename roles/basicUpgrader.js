module.exports = {
  /** @param {Creep} creep **/
  run: function(creep) {
    creep.memory.role = 'upgrader'
    if(creep.memory.task == 'upgrade' && creep.carry.energy == 0) {
      creep.memory.task = 'harvest'
      creep.say('harvest')
    }
    if(creep.memory.task == 'harvest' && creep.carry.energy == creep.carryCapacity) {
      creep.memory.task = 'upgrade'
      creep.say('upgrade')
    }
    if(creep.memory.task == 'upgrade') {
      if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.controller)
    }
    if(creep.memory.task == 'harvest') {
      let harvestTargets = creep.room.find(FIND_SOURCES)
      harvestTargets.sort( (a,b) => a.energy- b.energy)
      if(creep.harvest(harvestTargets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(harvestTargets[0])
      }
    }
  }
}
