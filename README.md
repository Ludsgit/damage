### Description
A tera-toolbox module that calculates the total damage modifier of a character based on ingame stats and the mod settings.

### Commands
All commands start with /8 damage:

/8 damage: prints your current damage modifier
- boss: displays current boss resistance value
- - (value): changes boss resistance to value
- tank: displays current tank and its amp/resist value
- - (value): changes resistance (amp for brawler) to value
- - (class): changes the class of the tank. Possible classes are "warrior", "brawler" and "lancer"
- healer: displays current healer's mag resist value
- - (value): changes healer resistance to value
- wine: displays current wine configuration for self, tank and healer
- - (user): toggles on/off wine for user. Possible users are "me", "self", "tank", "healer"
- aura: displays the current tiers of all 4 auras
- - (type): display current tier of type aura
- - - (tier): sets type aura to level tier. Possible types are "amp", "pres", "mres", "pierce". Possible tiers are 0 - 5
- skill: display current skill modifiers and skill crit rate
- - (type) (value): sets skill type modifier to value. Possible types are "main", "sec". Physical and magical modifiers are determined according to class
- - crit (value): sets the skill crit rate to value%
- curse: toggles on/off cruel curse effect
- sentence: toggles on/off death sentence effect
- shred: toggles on/off display of boss defenses with damage modifier
- inspect: toggles on/off display of damage modifier when inspecting someone
- - (name) (server): prints damage modifier of name from server. Possible servers: "Yurian", "Seren", "Mystel", "Shakan", "Velik", "Kaia" and "Shen". If player is in the same server as you, server argument is not needed
- power: toggles on/off using power for damage modifier calculation
- equip (jewel.): calculates your damage modifier after equipping a linked ring/earring/circlet/necklace. Power calculation currently not supported with this function
- - - rollback/1: calculates your damage modifier after equipping the previous set of rolls of a linked ring/earring/circlet/necklace. Power calculation currently not supported with this function
- add: displays whether stats holding is enabled, and if so displays the currently held stats.
- add (stat) (value): calculates damage modifier after adding value to stat. Possible stats are "cp", "pierce", "ignore", "amp", "power". Class passives will be applied to the added stat(s). Currently not supported when inspecting other players; damage modifier will be wrong if you inspect another type of class than your own
- add hold: toggles on/off holding the stats added for the previous command. If hold is enabled, modifier calculation has to be manually requested.

### Math

Total modifier calculated according to the following formulas:

totalModifier = normalCritPow * 0.9 + physCritPower * physAmp * skillPhysFactor / (100000 + physDef) + magCritPower * magAmp * skillMagFactor / (100000 + magDef)

where typeDef = max(-33333, baseResist * pierceMultiplier - shred - resistIgnore)

where pierceMultiplier = max(1 - (pierce / (pierce + 10000)), 0.2)

and total modifier is multipied by a factor (1 + bonusPower / (basePower + 100)) * (3 + 0.03 * basePower) if power is enabled for calculation

(formulas taken from tera -theorycraft discord)
