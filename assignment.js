//let hash = require('object_hash')

module.exports = {
  create: (task, target) => {
    //let result = {key: hash(`${target.id}+${Date.now()}`), target: target, task: task}
    let result = {targetId: target.id, task: task}
    //console.log(`assignment: ${JSON.stringify(result)}`)
    return result
  },
  getHarvestCount: (room, creepCount) => {
    let result = 0
    //console.log(`energy available/capacity: ${room.energyAvailable}/${room.energyCapacityAvailable})
    if(room.energyAvailable * 2 < room.energyCapacityAvailable) result = 1
    //console.log(`getHarvestCount: ${result}`)
    return result
  },
  getUpgradeCount: (room, creepCount) => {
    let result = 1
    let cont = true
    while(cont) {
      if(result < creepCount / 3) result++
      else cont = false
    }
    //console.log(`getUpgradeCount: ${result}`)
    return result
  },
}
