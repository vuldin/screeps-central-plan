# screeps-central-plan

current status: hard-coded to just upgrade, most everything else is broke

The screep API for figuring out what actions are possible in your location (building, upgrading, repairing, harvesting, etc.) starts at the individual creep.
But I wanted to be able to create a central plan for my realm by:
1. looking around at whatever room I have units in
2. creating a list of possible assignments
3. prioritizing those assignments
4. determining which creeps are available to take on a new assignment
5. sending off an assignment to an available creep that is best suited for that assignment (until all available creeps are busy)
6. get regular notifications from the creeps on status
7. eventually get a notification from the creeps that their assignment is completed
8. rinse and repeat

The above plan seems like a good way to ensure your realm is always handling priorities correctly, and then you can expand on this by changing the priority depending on the short/medium/long term plan you are working towards.

Keep in mind that I've never played screeps (started on 11/20/16), I haven't looked at anyone else's plans, and I have no idea if the above plan will work.

Uses the awesome [screeps-remote](https://github.com/overra/screeps-remote) library for accessing the Screeps API. I also used the example project [screeps-remote-example](https://github.com/troygoode/screeps-remote-example) to get started with integrating this project and the Screeps API.
