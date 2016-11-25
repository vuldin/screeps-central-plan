module.exports = {
  /** @param {Creep} creep **/
  run: function(creep, target) {
    creep.memory.role = 'repairer'
    if(creep.memory.task == 'building' && creep.carry.energy == 0) {
      creep.memory.task = 'harvesting'
      creep.memory.available = true
      creep.say('harvesting')
    }
    if(creep.memory.task == 'harvesting' && creep.carry.energy == creep.carryCapacity) {
      //creep.memory.task = 'building'
      //creep.memory.available = false
      creep.say('building')
    }
    if(creep.memory.task == 'building') {
      /*
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if(targets.length) {
        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      }
      */
      if(creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
      }
      else creep.memory.available = true
    }
    else {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
      }
    }
  }
}
