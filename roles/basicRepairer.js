module.exports = {
  /** @param {Creep} creep **/
  run: (creep) => {
    creep.memory.role = 'repairer'
    if(creep.memory.task == 'repair' && creep.carry.energy == 0) {
      creep.memory.task = 'harvest'
      creep.say('harvest')
    }
    if(creep.memory.task == 'harvest' && creep.carry.energy == creep.carryCapacity) {
      creep.memory.task = 'repair'
      creep.say('repair')
    }
    if(creep.memory.task == 'repair') { // repairs if needed, otherwise builds
      let repairTargets = creep.room.find(FIND_STRUCTURES, {
        filter: object => (
          object.hits < object.hitsMax &&
          object.hitsMax * .0035 > object.hits)
      })
      //repairTargets.sort( (a,b) => a.hits - b.hits)
      if(repairTargets.length > 0) { // repair
        if(creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(repairTargets[0])
        }
      }
    }
    if(creep.memory.task == 'harvest') {
      let harvestTargets = creep.room.find(FIND_SOURCES)
      //harvestTargets.sort( (a,b) => a.energy - b.energy)
      harvestTargets.sort( (a,b) => a.id - b.id)
      if(creep.harvest(harvestTargets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(harvestTargets[0])
      }
    }
  }
}
