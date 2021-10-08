#### Description
A tera-toolbox module that calculates the total damage modifier of a character based on ingame stats and the mod settings.

#### Commands
All commands start with /8 damage:

/8 damage: prints your current damage modifier
- boss: displays current boss resistance value
- - (value): changes boss resistance to value
- tank: displays current tank and its amp/resist value
- - (value): changes resistance (amp for brawler) to value
- - (class): changes the class of the tank. Possible classes are "warrior", "brawler" and "lancer"
- healer: displays current healer's mag resist value
- - (value): changes healer resistance to value
- wine: displays current wine configuration for sel, tank and healer
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
- - (name) (server): prints damage modifier of name from server. WARNING: If wine is enabled for self, result will be wrong unless it's the same/similar class as yours
						   Possible servers: "Yurian", "Seren", "Mystel", "Shakan". If player is in the same server as you, server argument is not needed
- power: toggles on/off using power for damage modifier calculation