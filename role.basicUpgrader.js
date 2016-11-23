module.exports = {
  /** @param {Creep} creep **/
  run: function(creep) {
    creep.memory.role = 'upgrader'
    if(creep.memory.task == 'upgrading' && creep.carry.energy == 0) {
      creep.memory.task = 'harvesting'
      creep.say('harvesting')
    }
    if(creep.memory.task == 'harvesting' && creep.carry.energy == creep.carryCapacity) {
      creep.memory.task = 'upgrading'
      creep.say('upgrading')
    }
    if(creep.memory.task == 'upgrading') {
      if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.controller)
    }
    if(creep.memory.task == 'harvesting') {
      let sources = creep.room.find(FIND_SOURCES)
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) creep.moveTo(sources[0])
    }
  }
}

module.exports = roleUpgrader;
