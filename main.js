let hash = require('object_hash')
let roleBasicUpgrader = require('roles.basicUpgrader')
let roleBasicHarvester = require('roles.basicHarvester')
let roleBasicRepairer = require('roles.basicRepairer')
let roleBasicBuilder = require('roles.basicBuilder')
let creepHandler = require('creepHandler')

// bodies
let bodies = new Map()
/* MOVE   50
 * WORK   100
 * CARRY  50
 * ATTACK 80
 * RANGED_ATTACK  150
 * HEAL   250
 * CLAIM  600
 * TOUGH  10
*/
bodies.set(250, [WORK,CARRY,MOVE,MOVE])
bodies.set(380, [WORK,CARRY,CARRY,MOVE,MOVE,MOVE])
bodies.set(400, [WORK,WORK,CARRY,MOVE,MOVE,MOVE])
bodies.set(500, [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE])
bodies.set(630, [ATTACK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE])

// assignments
//let assignments = new Map()
let assignmentFactory = require('assignment')

// create a creep with the best body
let spawnCreep = (room, spawn, bodies) => {
  let bestBody = []
  let topEnergy = spawn.energy
  //room.find(FIND_STRUCTURES, {filter:{structureType: STRUCTURE_EXTENSION}})
  for(let energyCost of bodies.keys()) {
    if(energyCost <= room.energyCapacityAvailable) {
      bestBody = bodies.get(energyCost)
    }
  }
  //console.log('bestBody',bestBody)
  for(var spawnName in Game.spawns) {
    let spawn = Game.spawns[spawnName]
    if(spawn.spawning == null && spawn.canCreateCreep(bestBody, null) == OK){
      console.log(`creating this body: ${JSON.stringify(bestBody)}`)
      //spawn.createCreep(bestBody)
      spawn.createCreep(bestBody, undefined, {role: '', task: 'harvest', available: true})
    }
  }
}
let okToSpawn = spawn => {
  let result = false
  // create best all around possible
  if(spawn.energy == spawn.energyCapacity && spawn.spawning == null) result = true
  return result
}

module.exports.loop = () => {
  // cleanup memory
  for(let name in Memory.creeps) {
    if(!Game.creeps[name]) delete Memory.creeps[name]
  }
  for(let name in Memory.rooms) {
    if(!Game.rooms[name]) delete Memory.rooms[name]
  }

  let rooms = new Map()
  for(let roomName in Game.rooms) {
    let room = Game.rooms[roomName]
    //console.log(`available energy capacity: ${room.energyCapacityAvailable}`)
    // for each spawn, determine the best creep we can create
    for(let spawnName in Game.spawns) {
      let spawn = Game.spawns[spawnName]
      if(okToSpawn(spawn)) spawnCreep(room, spawn, bodies)
    }
    let buildTargets = room.find(FIND_CONSTRUCTION_SITES) // TODO sort based on health, delta in health, etc.
    let harvestTargets = room.find(FIND_SOURCES) // TODO sort based on proximity, energy level, renew timer, etc.
    let repairTargets = room.find(FIND_STRUCTURES, { filter: object => object.hits < object.hitsMax }) // TODO sort based on health, delta in health, etc.
    //console.log(`build/repair/harvest targets: ${buildTargets.length}/${repairTargets.length}/${harvestTargets.length}`)

    //creeps
    let creeps  = room.find(FIND_MY_CREEPS/*,{ filter: creep => creep.getActiveBodyparts(ATTACK) == 0}*/)
    //console.log(`room ${room.name} creep count: ${creeps.length}`)
    creepHandler(creeps)

    // assignments
    // TODO make number of assignments related to total number of creeps
    // always have 1 harvesting if energy is below a certain a level
    // always have between 1 and 1/3 upgrading
    // prioritize targets
    // create index for assignment based on location
    // assign creeps 
    // have creeps report back while working on assignment
    // if no message is received for particular assignment then reassign to another open location
    // ie. 3 creeps, 1 target: 
    let newAssignments = new Map()
    // harvest
    let harvestCount = assignmentFactory.getHarvestCount(room, creeps.length)
    //console.log(`harvestCount: ${harvestCount}`)
    for(let i = 0; i < harvestCount; i++) {
      let assignment = assignmentFactory.create('harvest', harvestTargets[0]) // TODO hardcoded to the first harvest target
      assignment = JSON.parse(JSON.stringify(assignment)) // TODO not sure why this is needed
      //console.log('harvest',JSON.stringify(assignment))
      let key = hash(assignment)
      //console.log(`assignment: ${JSON.stringify(assignment)}, ${checksum}`)
      newAssignments.set(key, {hash: key, date: Date.now(), assignment: assignment})
    }

    // upgrade
    let upgradeCount = assignmentFactory.getUpgradeCount(room, creeps.length)
    //console.log(`upgradeCount: ${upgradeCount}`)
    for(let i = 0; i < upgradeCount; i++) {
      let assignment = assignmentFactory.create('upgrade', room.controller) // TODO hardcoded to the room controller
      assignment = JSON.parse(JSON.stringify(assignment)) // TODO not sure why this is needed
      //console.log('upgrade',JSON.stringify(assignment))
      let key = hash(assignment)
      //console.log(`upgrade assignment: ${JSON.stringify(assignment)}, ${checksum}`)
      newAssignments.set(key, {hash: key, date: Date.now(), assignment: assignment})
    }

    let assignments = null
    if (room.memory.assignments == undefined || Object.getOwnPropertyNames(room.memory.assignments).length == 0) {
      console.log('room assignments empty!')
      assignments = new Map()
    } else {
      //console.log('room assignments not empty')
      assignments = new Map(JSON.parse(room.memory.assignments))
    }
    //console.log('assignments length',assignments.size)
    let printAssignments = false
    for (let oldKey of assignments.keys()) { // clear out old assignments
      if(Date.now() - assignments.get(oldKey).date > 10000) assignments.delete(oldKey)
    }
    for (let newKey of newAssignments.keys()) {
      //console.log(`new key ${newKey} is...`)
      let newAssignment = newAssignments.get(newKey)
      let handled = false
      for (let oldKey of assignments.keys()) {
        if(oldKey == newKey) { // newAssignment isn't new
          handled = true
          let newHash = newAssignment.hash
          let oldHash = assignments.get(oldKey).hash
          if(newHash != oldHash) { // newAssignment is an update
            printAssignments = true
            //console.log(`\t...an update`)
            assignments.set(newKey, newAssignment)
            //console.log(`assignment ${newKey} updated`)
          } //else console.log(`\t...old`)
        }
      }
      if(!handled) { // newAssignment is new
        printAssignments = true
        //console.log(`\t...new`)
        assignments.set(newKey, newAssignment)
        //console.log(`new assignment ${newKey}`)
      }
    }
    // assign owner
    //console.log('creeps length:', creeps.length)
    //console.log('assignments length:', assignments.size)
    /*
    creeps.forEach( (creep,i) => { // TODO assumes there will always be at least as many assignments as creeps
      //console.log(creep.name, creep.memory.role)
    })
    */
    /*
    for(let assignment of assignments.values()) {
    }
    */
    /*
    if(printAssignments) { // print
      for(let assignment of assignments.values()) {
        console.log(JSON.stringify(assignment))
      }
    }
    */

    // temp
    creeps.sort( (a, b) => a.id.localeCompare(b.id) )
    let upgradersNeeded = Math.ceil(creeps.length * .3)
    //console.log('needed upgraders', upgradersNeeded)
    let harvestersNeeded = Math.ceil(creeps.length * .3)
    //console.log('needed harvesters', harvestersNeeded)
    let repairersNeeded = Math.ceil(creeps.length * .1)
    //console.log('needed repairers', repairersNeeded)
    let buildersNeeded = Math.ceil(creeps.length * .3)
    //console.log('needed builders', buildersNeeded)
    let upgraderCount = 0
    let harvesterCount = 0
    let repairerCount = 0
    let builderCount = 0
    rolelessCreeps = []
    creeps.forEach( (creep,i) => {
      /*
      if(i % 3 == 0) roleBasicUpgrader.run(creep)
      if(i % 3 == 1) roleBasicHarvester.run(creep)
      if(i % 3 == 2) roleBasicRepairer.run(creep)
      */
      let counted = false
      if(creep.memory.role == 'upgrader') {
        upgraderCount++
        roleBasicUpgrader.run(creep)
        counted = true
      }
      if(creep.memory.role == 'harvester') {
        harvesterCount++
        roleBasicHarvester.run(creep)
        counted = true
      }
      if(creep.memory.role == 'repairer') {
        repairerCount++
        roleBasicRepairer.run(creep)
        counted = true
      }
      if(creep.memory.role == 'builder') {
        builderCount++
        roleBasicBuilder.run(creep)
        counted = true
      }
      if(!counted) { // assign appropriate role
        rolelessCreeps.push(creep)
      }
    })
    rolelessCreeps.forEach( creep => {
      let roleApplied = false
      if(upgraderCount < upgradersNeeded) {
        console.log('new upgrader')
        upgraderCount++
        roleBasicUpgrader.run(creep)
        roleApplied = true
      }
      else if(harvesterCount < harvestersNeeded) {
        console.log('new harvester')
        harvesterCount++
        roleBasicHarvester.run(creep)
        roleApplied = true
      }
      else if(repairerCount < repairersNeeded) {
        console.log('new repairer')
        repairerCount++
        roleBasicRepairer.run(creep)
        roleApplied = true
      }
      else if(builderCount < buildersNeeded) {
        console.log('new builder')
        builderCount++
        roleBasicBuilder.run(creep)
        roleApplied = true
      }
      if(!roleApplied) roleBasicHarvester.run(creep)
    })
    room.memory.assignments = JSON.stringify([...assignments])
  }
}
