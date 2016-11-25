module.exports = function(creeps) {
  creeps.forEach( creep => {
    if(creep.memory.pos == undefined) creep.memory.pos = {x:0,y:0,roomName:''}
    //if(creep.memory.pos == creep.pos) console.log('old pos')
    if(creep.memory.pos.x == creep.pos.x
      && creep.memory.pos.y == creep.pos.y
      && creep.memory.pos.roomName == creep.pos.roomName
    ) {
      if(creep.fatigue > 0) console.log(`${creep.name} is stopped and has fatigue`)
    }
    else creep.memory.pos = creep.pos
  })
}
