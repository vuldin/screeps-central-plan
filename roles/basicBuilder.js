module.exports = {
  /** @param {Creep} creep **/
  run: (creep) => {
    creep.memory.role = 'builder'
    if(creep.memory.task == 'build' && creep.carry.energy == 0) {
      creep.memory.task = 'harvest'
      creep.say('harvest')
    }
    if(creep.memory.task == 'harvest' && creep.carry.energy == creep.carryCapacity) {
      creep.memory.task = 'build'
      creep.say('build')
    }
    if(creep.memory.task == 'build') {
      let buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES)
      if(buildTargets.length) {
        if(creep.build(buildTargets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(buildTargets[0])
        }
      }
    }
    if(creep.memory.task == 'harvest') {
      let harvestTargets = creep.room.find(FIND_SOURCES)
      //harvestTargets.sort( (a,b) => a.energy - b.energy)
      if(creep.harvest(harvestTargets[1]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(harvestTargets[1])
      }
    }
  }
}
