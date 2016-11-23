module.exports = function(map) {
  for(var role of map.keys()) {
    var roleMembers = _.filter(Game.creeps, (creep) => creep.memory.role == role)
    var roleDetail = map.get(role)
    roleDetail.count = roleMembers.length
    console.log(`${role}s: ${roleDetail.count}`)
    if(roleDetail.count < roleDetail.max) {
      var newName = Game.spawns['Spawn1'].createCreep(roleDetail.body, undefined, {role: role, task: roleDetail.defaultTask, available: true})
      console.log(`Spawning new ${role}: ${newName}`)
    }
  }
}
