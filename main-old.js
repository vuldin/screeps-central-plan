/*
var roleHarvester = require('roles.harvester')
var roleUpgrader = require('roles.upgrader')
var roleBuilder = require('roles.builder')
*/
var roleBasicUpgrader = require('roles.basicUpgrader')
var roleBasicHarvester = require('roles.basicHarvester')
var autospawn = require('autospawn')
let assignmentFactory = require('assignment')
let lastId = 0 // keep track of last id used

let types = new Map()
types.set('harvester', {count: 0, max: 0, body: [WORK,CARRY,MOVE], defaultTask: 'harvesting'})
types.set('upgrader', {count: 0, max: 1, body: [WORK,CARRY,MOVE], defaultTask: 'harvesting'})
types.set('builder', {count: 0, max: 0, body: [WORK,CARRY,MOVE], defaultTask: 'harvesting'})

// cycle: set of tasks that is equal to the number of current creeps
let upgradeCount = 2 // number of upgraders in a cycle
let harvestCount = 0 // TODO set this based on energy needs

module.exports.loop = () => {
  // cleanup memory
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
      delete Memory.creeps[name]
      console.log('Clearing non-existing creep memory:', name)
    }
  }
  // autospawn
  autospawn(types)

  // check for enemies
  // if enemies exist, prioritize enemies (healers, proximity)
  // create assignments per room
  let rooms = new Map() // map of room objects with associated array of creeps
  for(let roomName in Game.rooms) {
    for(let creepName in Game.creeps) {
      let creep = Game.creeps[creepName]
      let room = creep.room
      if(!rooms.has(room.name)) rooms.set(roomName, {room: room, creeps: [], assignments: []})
      else rooms.get(roomName).creeps.push(creep)
    }
  }
  for (let val of rooms.values()) {
    let buildTargets = val.room.find(FIND_CONSTRUCTION_SITES) // TODO sort based on health, delta in health, etc.
    let harvestTargets = val.room.find(FIND_SOURCES) // TODO sort based on proximity, energy level, renew timer, etc.
    let repairTargets = val.room.find(FIND_STRUCTURES, { filter: object => object.hits < object.hitsMax }) // TODO sort based on health, delta in health, etc.
    let assignments = []
    console.log(`build/repair/harvest targets: ${buildTargets.length}/${repairTargets.length}/${harvestTargets.length}`)

    let cont = true
    let iter = 0
    while(cont) {
      //console.log('assignment loop',iter)
      if(iter % 2 == 0) {
        console.log(`lastId: ${lastId}`)
        let assignment = assignmentFactory.create('build', buildTargets.splice(0, 1)[0], lastId)
        console.log(JSON.stringify(assignment))
        lastId = assignment.id
        if(buildTargets.length > 0) val.assignments.push(assignment)
      }
      else if(repairTargets.length > 0) {
        let assignment = assignmentFactory.create('repair', repairTargets.splice(0, 1)[0],lastId)
        lastId = assignment.id
        val.assignments.push(assignment)
      }
      if(buildTargets.length + repairTargets.length == 0) cont = false
      else iter++
    }
    let loc = val.creeps.length - (upgradeCount + harvestCount)
    if(loc < 0) loc = 0
    let upgradeAssignments = []
    for(let i = 0; i < upgradeCount; i++) {
      let assignment = assignmentFactory.create('upgrade', val.room.controller, lastId)
      lastId = assignment.id
      upgradeAssignments.push(assignment)
    }
    //val.assignments.splice(loc, 0, {target: val.room.controller, task: 'upgrade'})
    val.assignments.splice(loc, 0, ...upgradeAssignments)
    console.log(`assignment length: ${JSON.stringify(val.assignments.length)}, creeper available/count: ${val.creeps.filter( creep => creep.memory.available).length}/${val.creeps.length}`)
    //val.assignments.forEach( assignment => console.log(`${assignment.task}, ${JSON.stringify(assignment.target.pos)}`) )
    //console.log(process.hrtime())
    val.assignments.forEach( (assignment,i) => console.log(`${i+1}: ${assignment.id}`)) 
    /*
    val.creeps.forEach( creep => {
      let assignment = val.assignments.splice(1,0)
      if(assignment.task == 'build') roleBuilder.run(creep, assignment.target)
      if(assignment.task == 'repair') roleRepairer.run(creep, assignment.target)
      if(assignment.task == 'upgrade') roleUpgrader.run(creep, assignment.target)
    })
    */
    val.creeps.forEach( creep => {
      //creep.memory.task = 'harvesting'
      roleBasicUpgrader.run(creep)
    })
  }

  // set creep tasks
  /*
  for(var name in Game.creeps) {
    var creep = Game.creeps[name]
    if(creep.memory.role == 'harvester') roleHarvester.run(creep)
    if(creep.memory.role == 'upgrader') roleUpgrader.run(creep)
    if(creep.memory.role == 'builder') roleBuilder.run(creep)
  }
  */
}
