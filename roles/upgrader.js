module.exports = {
  /** @param {Creep} creep **/
  run: function(creep, target) {
    // set task
    creep.memory.role == 'upgrader'
    if(creep.memory.task == 'upgrading' && creep.carry.energy == 0) {
      creep.memory.task = 'harvesting'
      creep.say('harvesting')
      creep.memory.available = true
    }
    if(creep.memory.task == 'harvesting' && creep.carry.energy == creep.carryCapacity) {
      //creep.memory.task = 'upgrading'
      creep.say('upgrading')
      //creep.memory.available = false
    }
    // perform task
    // old
    /*
    if(creep.memory.task == 'harvesting') {
      //var sources = creep.room.find(FIND_SOURCES)
      if(target) == ERR_NOT_IN_RANGE) creep.moveTo(target)
    }
    if(creep.memory.task == 'upgrade') {
      if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.controller)
    }
    */
    // new
    if(creep.memory.task == 'upgrading') {
      if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) creep.moveTo(target)
      else creep.memory.available = true
    }
    else {
      var sources = creep.room.find(FIND_SOURCES)
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) creep.moveTo(sources[0])
    }
  }
}
