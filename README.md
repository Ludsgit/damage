### Description
A tera-toolbox module that calculates the total mod of a character based on ingame stats and the mod settings.

### Commands
All commands start with /8 damage or /8 dmg:

/8 damage: prints your current total mod
- boss: displays current boss resistance value
- - (value): changes boss resistance to value
- tank: displays current tank and its amp/resist value
- - inspect: changes tank's class and amp/resist to that of next tank inspected. Use again to deactivate
- - - (name): changes tank class to name's class and changes tank resist/amp to name's resist/amp
- - (value): changes resistance (amp for brawler) to value
- - (class): changes the class of the tank. Possible classes are "warrior", "brawler" and "lancer"
- setTank: changes tank's class and amp/resist to that of next tank inspected. Use again to deactivate. Also works with "settank" and "st"
- - (name) (server): same as "/8 damage inspect tank (name)" and with possibility to set server
- healer: displays current healer's mag resist value. Also works with "heal"
- - inspect: changes healer resist to that of next healer inspected. Use again to deactivate
- - - (name): changes healer resistance to name's resistance
- - (value): changess healer resistance to value
- setHealer: change healer resist to that of next healer inspected. Use again to deactivate. Also works with "sethealer", "setheal", "setHeal" and "sh"
- - (name) (server): same as "/8 damage inspect healer (name)" and with possibility to set server
- wine: displays current wine configuration for self, tank and healer
- - (user): toggles on/off wine for user. Possible users are "me", "self", "tank", "healer"
- aura: displays the current tiers of all 4 auras
- - (type): display current tier of type aura
- - - (tier): sets type aura to level tier. Possible types are "amp", "pres", "mres", "pierce". Possible tiers are 0 - 5
- skill: display current skill factors and skill crit rate
- - (type) (value): sets skill type factor to value. Possible types are "main", "sec". Physical and magical factors are determined according to class
- - crit (value): sets the skill crit rate to value%
- curse: toggles on/off cruel curse effect
- sentence: toggles on/off death sentence effect
- resist: toggles on/off display of boss defenses with total mod
- shred: displays current shred
- inspect: toggles on/off display of total mod when inspecting someone
- - (name) (server): prints total mod of name from server. Possible servers: "Yurian", "Seren", "Mystel", "Shakan", "Velik", "Kaia" and "Shen". If player is in the same server as you, server argument is not needed
- apply: toggles on/off display of total mod when someone applies to your party
- power: toggles on/off adding power to total mod calculation
- equip (jewel.): calculates your total mod after equipping a linked ring/earring/circlet/necklace
- - - rollback/1: calculates your total mod after equipping the previous set of rolls of a linked ring/earring/circlet/necklace
- add: displays whether stats holding is enabled, and if so displays the currently held stats
- add (stat) (value): calculates total mod after adding value to stat. Possible stats are "cp", "pierce", "ignore", "amp", "power". Class passives will be applied to the added stat(s). Currently not supported when inspecting other players; total mod will be wrong if you inspect another type of class than your own
- add hold: toggles on/off holding the stats added for the previous command. If hold is enabled, total mod calculation has to be manually requested
- config: prints the current config values
- info: displays accepted commands. WIP. Also works with "help"
- (name) (server): same as "/8 damage inspect (name) (server)" if name is not one of the previous commands

### Math

Total mod calculated according to the following formulas:

totalMod = (0.9 * normalCritPow + (typeCritPower / (100000 + typeDef)) * (physAmp * skillPhysFactor + magAmp * skillMagFactor)) * critRate + (1 +  (physAmp * skillPhysFactor + magAmp * skillMagFactor) / (100000 + typeDef)) * (1 - critRate)

where typeDef = max(-33333, baseResist * pierceMultiplier - shred - resistIgnore)

where pierceMultiplier = max(1 - (pierce / (pierce + 10000)), 0.2)

and total mod is multipied by a factor (1 + bonusPower / (basePower + 100)) * (3 + 0.03 * basePower) if power is enabled for calculation.

(formulas taken from tera -theorycraft discord)
