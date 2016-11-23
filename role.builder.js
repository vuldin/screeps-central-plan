module.exports = {
  /** @param {Creep} creep **/
  run: function(creep, target) {
    creep.memory.role = 'builder'
    if(creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false
      creep.memory.available = true
      creep.say('harvesting')
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true
      creep.memory.available = false
      creep.say('building')
    }
    if(creep.memory.building) {
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
    }
    else {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
      }
    }
  }
}
