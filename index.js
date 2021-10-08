String.prototype.clr = function(hex_color) { return `<font color='#${hex_color}'>${this}</font>`; };

const clr1 = '009dff'
const clr2 = 'f2881e'
const clr3 = '1ef232'


const aura_amp = [1, 1.02, 1.025, 1.03, 1.035, 1.04]
const aura_pierce = [0, 667, 833, 1000, 1167, 1335]
const aura_pres = [1, 1.02, 1.025, 1.03, 1.035, 1.04]
const aura_mres = [1, 1.02, 1.025, 1.03, 1.035, 1.04]

const servers = {"Yurian": 28, "Mystel": 38, "Seren": 29, "Shakan": 40}
const classes = [["Warrior", "phys"], ["Lancer", "phys"], ["Slayer", "phys"], ["Berserker", "phys"], ["Sorcerer", "mag"], ["Archer", "phys"], ["Priest", "mag"], ["Mystic", "mag"], ["Reaper", "mag"], ["Gunner", "mag"], ["Brawler", "phys"], ["Ninja", "mag"], ["Valkyrie", "phys"]]


module.exports = function Damage(mod){
	
	let config = mod.settings;
	let loaded = true;
	
	let critPower = null;
	let critPowerPhysical = null;
	let critPowerMagical = null;
	let defenseReductionPhysical = null;
	let defenseReductionMagical =null;
	let piercingPhysical = null;
	let piercingMagical = null;
	let attackPhysical = null;
	let attackMagical = null;
	let tankShred = null;
	let healerShred = null;
	let piercingPhysicalMultiplier = null;
	let piercingMagicalMultiplier = null;
	let bossPhysicalDefense = null;
	let bossMagicalDefense = null;
	let bossPhysicalDefenseCapped = null;
	let bossMagicalDefenseCapped = null;
	let physicalModifier = null;
	let magicalModifier = null;
	let totalModifier = null;
	let shortModifier = null;
	let powerFactor = null;
	
	
	mod.command.add('damage', (arg1,arg2,arg3) => {
		if(!arg1){
			loaded = false
			mod.toServer("C_REQUEST_USER_PAPERDOLL_INFO", 4, {
				serverId: mod.game.me.serverId,
				zoom: false,
				name: mod.game.me.name				
			})
		}
		switch(arg1){
			case "boss":
				if(!arg2){
					mod.command.message(`
Boss resist value: ${config.boss_res}`.clr(clr3))
					return;
				} 
				if(isNaN(arg2)){
					mod.command.message("Boss resist must be a number".clr(clr2))
					return;
				}
				config.boss_res = parseFloat(arg2)
				mod.command.message(`Boss resist set to ${config.boss_res}`.clr(clr1))
				mod.saveSettings()
				break;
			case "tank":
				if(!arg2){
					mod.command.message(`
Tank: ${config.tank}. Tank's ${(config.tank === "brawler" ? "amp" : "resist")}: ${config.tank_res}`.clr(clr3))
					return;
				} 
				if(!isNaN(arg2)){
					config.tank_res = parseFloat(arg2)
					mod.command.message(`Tank physical ${(config.tank === "brawler" ? "amp" : "resist")} set to ${config.tank_res}`.clr(clr1))
					mod.saveSettings()
					break;
				}
				if(["warrior", "lancer", "brawler"].indexOf(arg2) !== -1){
					config.tank = arg2
					mod.command.message(`Tank class set to ${config.tank}`.clr(clr1))
					mod.saveSettings()
					break;
				}
				if(isNaN(arg2) && ["warrior", "lancer", "brawler"].indexOf(arg2) === -1){
					mod.command.message("Input must be a number or a tank class: warrior, lancer or brawler".clr(clr2))
					return;
				}
			case "healer":
				if(!arg2){
					mod.command.message(`
Healer resist: ${config.healer_res}`.clr(clr3))
					return;
				} 
				if(isNaN(arg2)){
					mod.command.message("Healer magical resist must be a number".clr(clr2))
					return;
				}
				config.healer_res = parseFloat(arg2)
				mod.command.message(`Healer magical resist set to ${config.healer_res}`.clr(clr1))
				mod.saveSettings()
				break;
			case "aura":
				if(!arg2){
					mod.command.message(`
Amplification aura tier: ${config.aura_amp}
Pierce aura tier: ${config.aura_pierce}
Phys resist aura tier: ${config.aura_pres}
Mag resist aura tier: ${config.aura_mres}`.clr(clr3))
					return;
				}
				switch(arg2){
					case "amp":
						if(!arg3){
							mod.command.message(`
Amplification aura tier: ${config.aura_amp}`.clr(clr3))
							return;
						}
						if(["0","1","2","3","4","5"].indexOf(arg3) === -1){
							mod.command.message("Aura tier must be from 0 to 5".clr(clr2))
							return;
						}
						config.aura_amp = arg3
						mod.command.message(`Amp aura set to tier ${config.aura_amp}`.clr(clr1))
						mod.saveSettings()
						break;
					case "pierce":
						if(!arg3){
							mod.command.message(`
Pierce aura tier: ${config.aura_pierce}`.clr(clr3))
							return;
						}
						if(["0","1","2","3","4","5"].indexOf(arg3) === -1){
							mod.command.message("Aura tier must be from 0 to 5".clr(clr2))
							return;
						}
						config.aura_pierce = arg3
						mod.command.message(`Pierce aura set to tier ${config.aura_pierce}`.clr(clr1))
						mod.saveSettings()
						break;
					case "pres":
						if(!arg3){
							mod.command.message(`
Phys resist aura tier: ${config.aura_pres}`.clr(clr3))
							return;
						}
						if(["0","1","2","3","4","5"].indexOf(arg3) === -1){
							mod.command.message("Aura tier must be from 0 to 5".clr(clr2))
							return;
						}
						config.aura_pres = arg3
						mod.command.message(`Phys res aura set to tier ${config.aura_pres}`.clr(clr1))
						mod.saveSettings()
						break;
					case "mres":
						if(!arg3){
							mod.command.message(`
Mag resist aura tier: ${config.aura_mres}`.clr(clr3))
							return;
						}
						if(["0","1","2","3","4","5"].indexOf(arg3) === -1){
							mod.command.message("Aura tier must be from 0 to 5".clr(clr2))
							return;
						}
						config.aura_mres = arg3
						mod.command.message(`Mag res aura set to tier ${config.aura_mres}`.clr(clr1))
						mod.saveSettings()
						break;
					default:
						mod.command.message("Aura not found. Accepted arguments are amp, pierce, pres and mres".clr(clr2))
				}
				break;
			case "wine":
				if(!arg2){
					mod.command.message(`
Wine for self is ${(config.wine_me ? "enabled" : "disabled")}.
Wine for tank is ${(config.wine_tank ? "enabled" : "disabled")}.
Wine for healer is ${(config.wine_healer ? "enabled" : "disabled")}.`.clr(clr3))
					return;
				} 
				switch(arg2){
					case "self":
					case "me":
						config.wine_me = !config.wine_me
						mod.command.message(`Wine on self ${(config.wine_me ? "enabled" : "disabled")}`.clr(clr1))
						mod.saveSettings()
						break;
					case "tank":
						config.wine_tank = !config.wine_tank
						mod.command.message(`Wine on tank ${(config.wine_tank ? "enabled" : "disabled")}`.clr(clr1))
						mod.saveSettings()
						break;
					case "healer":
						config.wine_healer = !config.wine_healer
						mod.command.message(`Wine on healer ${(config.wine_healer ? "enabled" : "disabled")}`.clr(clr1))
						mod.saveSettings()
						break;
					default:
					mod.command.message("Wine user not found. Accepted arguments are me, self, tank and healer".clr(clr2))
				}
				break;
			case "curse":
				config.cruel_curse = !config.cruel_curse
				mod.command.message(`Cruel curse ${(config.cruel_curse ? "enabled" : "disabled")}`.clr(clr1))
				mod.saveSettings()
				break;
			case "sentence":
				config.death_sentence = !config.death_sentence
				mod.command.message(`Death sentence ${(config.death_sentence ? "enabled" : "disabled")}`.clr(clr1))
				mod.saveSettings()
				break;
			case "skill":
				if(!arg2){
					mod.command.message(`
Skill main modifier: ${config.skill_main_mod}.
Skill sec modifier: ${config.skill_sec_mod}.
Skill crit rate: ${config.crit_rate}`.clr(clr3))
					return;
				} 
				if(!arg3){
					mod.command.message("Missing crit/skill modifier value".clr(clr2))
					return;
				} 
				if(isNaN(arg3)){
					mod.command.message("Crit/skill modifier must be a number".clr(clr2))
					return;
				} 
				switch(arg2){
					case "main":
						config.skill_main_mod = parseFloat(arg3)
						mod.command.message(`Skill main modifier set to ${config.skill_main_mod}`.clr(clr1))
						mod.saveSettings()
						break;
					case "sec":
						config.skill_sec_mod = parseFloat(arg3)
						mod.command.message(`Skill secondary modifier set to ${config.skill_sec_mod}`.clr(clr1))
						mod.saveSettings()
						break;
					case "crit":
						if(arg3 < 0 || arg3 > 100){
							mod.command.message("Crit rate must be between 0 and 100".clr(clr2))
							return;
						}
						config.crit_rate = parseFloat(arg3)
						mod.command.message(`Crit rate set to ${config.crit_rate}%`.clr(clr1))
						mod.saveSettings()
						break;	
					default:
					mod.command.message("Type of skill modifier not found. Accepted arguments are main, sec and crit".clr(clr2))
				}
				break;
			case "shred":
				config.shred = !config.shred
				mod.command.message(`Shred display ${(config.shred ? "enabled" : "disabled")}`.clr(clr1))
				mod.saveSettings()
				break;
			case "inspect":
				if(!arg2){
					config.auto_inspect = !config.auto_inspect
					mod.command.message(`Automatic damage modifier calculation on inspection ${(config.auto_inspect ? "enabled" : "disabled")}`.clr(clr1))
					mod.saveSettings()
					return;
				}
				if(!arg3){
					loaded = false
					mod.toServer("C_REQUEST_USER_PAPERDOLL_INFO", 4, {
						serverId: mod.game.me.serverId,
						zoom: false,
						name: arg2				
					})
					return;
				}
				if(["Yurian", "Mystel", "Seren", "Shakan"].indexOf(arg3) !== -1){
					loaded = false
					mod.toServer("C_REQUEST_USER_PAPERDOLL_INFO", 4, {
						serverId: servers[arg3],
						zoom: false,
						name: arg2				
					})
				} else {
					mod.command.message("The accepted servers are Yurian, Mystel, Seren and Shakan")
					return;
				}
				break;
			case "power":
				config.power = !config.power
				mod.command.message(`Using power for damage modifier ${(config.power ? "enabled" : "disabled")}`.clr(clr1))
				mod.saveSettings()
				break;
			default:
				if(arg2){
					mod.command.message("Command not found. Accepted are boss, tank, healer, aura, wine, curse, sentence, skill, shred, inspect and power".clr(clr2))
					return;
				}
		}
	})
	
	mod.hook("S_USER_PAPERDOLL_INFO", 15, (event) => {
		if(!loaded || config.auto_inspect){
			
			critPower = event.critPower + event.critPowerBonus
			critPowerPhysical = event.critPowerPhysical + event.critPowerPhysicalBonus
			critPowerMagical = event.critPowerMagical + event.critPowerMagicalBonus
			defenseReductionPhysical = event.defenseReductionPhysical+ event.defenseReductionPhysicalBonus
			defenseReductionMagical = event.defenseReductionMagical + event.defenseReductionMagicalBonus
			piercingPhysical = event.piercingPhysical + event.piercingPhysicalBonus
			piercingMagical = event.piercingMagical + event.piercingMagicalBonus
			attackPhysical = event.attackPhysicalMin + event.attackPhysicalMinBonus
			attackMagical = event.attackMagicalMin + event.attackMagicalMinBonus
			
			if(config.wine_me){
				if(classes[event.templateId % 100 - 1][1] === "phys"){
					critPowerPhysical = critPowerPhysical + 0.05
					attackPhysical = attackPhysical + 8000
				} else if (classes[event.templateId % 100 - 1][1] === "mag"){
					critPowerMagical = critPowerMagical + 0.05
					attackMagical = attackMagical + 8000
				}
				switch(classes[event.templateId % 100 - 1][0]){
					case "Warrior":
						defenseReductionPhysical = defenseReductionPhysical + 0.05 * 15000
						break;
					case "Slayer":
						defenseReductionPhysical = defenseReductionPhysical + 8000 * 0.04
						defenseReductionPhysical = defenseReductionPhysical + 0.02 * attackPhysical
						break;
					case "Archer":
						piercingPhysical = piercingPhysical + 0.05 * (mod.majorPatchVersion >= 111 ? 2500 : 5000)
						break;
					case "Reaper":
						defenseReductionMagical = defenseReductionMagical + 8000 * 0.04
						defenseReductionMagical = defenseReductionMagical + 0.02 * attackMagical
						break;
					case "Ninja":
						piercingMagical = piercingMagical + 8000 * 0.01
						break;
					case "Brawler":
						attackPhysical = attackPhysical + 8000 * 0.05
						break;
					case "Gunner":
						mod.command.message("Gunner passive is currently not supported")
						break;
					case "Valkyrie":
						mod.command.message("Valkyrie passive is currently not supported")
						break;
					case "Lancer":
						mod.command.message("Lancer passive is currently not supported")
						break;
					default:
						mod.command.message(`${classes[event.templateId % 100 - 1][0]} has no damage passives affected by wine`)
				}
			}
			
			attackPhysical = attackPhysical * aura_amp[config.aura_amp]
			attackMagical = attackMagical * aura_amp[config.aura_amp]
			piercingPhysical = piercingPhysical + aura_pierce[config.aura_pierce]
			piercingMagical = piercingMagical + aura_pierce[config.aura_pierce]
			
			switch(config.tank){
				case "warrior":
					tankShred = 0.1 * (config.tank_res + (config.wine_tank ? 4000 * 1.25 : 0)) * aura_pres[config.aura_pres]
					break;
				case "lancer":
					tankShred = 0.1 * (config.tank_res + (config.wine_tank ? 4000 * 1.05 : 0)) * aura_pres[config.aura_pres]
					break;
				case "brawler":
					tankShred = 0.05 * (config.tank_res + (config.wine_tank ? 8000 * 1.05 : 0)) * aura_pres[config.aura_amp]
					break;
			}
			healerShred = 0.1 * (config.healer_res + (config.wine_healer ? 4000 : 0)) * aura_mres[config.aura_mres]
			
			piercingPhysicalMultiplier = Math.min( piercingPhysical / (10000 + piercingPhysical), 0.8 )
			piercingMagicalMultiplier = Math.min( piercingMagical / (10000 + piercingMagical), 0.8 )
			
			bossPhysicalDefense = config.boss_res * (1 - piercingPhysicalMultiplier) - tankShred - healerShred - defenseReductionPhysical - (config.death_sentence ? 5000 : 0) - (config.cruel_curse ? 9400 : 0)
			bossMagicalDefense = config.boss_res * (1 - piercingMagicalMultiplier) - tankShred - healerShred - defenseReductionMagical - (config.death_sentence ? 5000 : 0) - (config.cruel_curse ? 9400 : 0)
			
			bossPhysicalDefenseCapped = Math.max( bossPhysicalDefense, -33333)
			bossMagicalDefenseCapped = Math.max( bossMagicalDefense, -33333)
			
			physicalModifier = attackPhysical * (classes[event.templateId % 100 - 1][1] === "phys" ? config.skill_main_mod : config.skill_sec_mod) / 100 / (100000 + bossPhysicalDefenseCapped)
			magicalModifier = attackMagical * (classes[event.templateId % 100 - 1][1] === "mag" ? config.skill_main_mod : config.skill_sec_mod) / 100 / (100000 + bossMagicalDefenseCapped)
			
			totalModifier = (critPower * 0.9 + physicalModifier * critPowerPhysical  + magicalModifier * critPowerMagical) * config.crit_rate / 100 + (1 - config.crit_rate / 100) * (1 + physicalModifier + magicalModifier)
			
			powerFactor = (1 + event.powerBonus / (100 + event.powerBonus) )// * (3 + 0.03 * event.power)
			
			totalModifier = totalModifier * (config.power ? powerFactor : 1)
			shortModifier =  Math.round(totalModifier * 100) / 100
			
			
			if(config.shred){
				if(classes[event.templateId % 100 - 1][1] === "phys"){
					mod.command.message(`
Total modifier = ${shortModifier}
Boss phys defense = ${Math.ceil(bossPhysicalDefenseCapped)} (${Math.ceil(bossPhysicalDefense)})`.clr(clr3))
				}
				if(classes[event.templateId % 100 - 1][1] === "mag"){
					mod.command.message(`
Total modifier = ${shortModifier}
Boss mag defense = ${Math.ceil(bossMagicalDefenseCapped)} (${Math.ceil(bossMagicalDefense)})`.clr(clr3))
				}
			} else {
				mod.command.message(`
Total modifier = ${shortModifier}`.clr(clr3))
			}
			
			loaded = true
			return (event.gameId === mod.game.me.gameId ? false : undefined)
		}
	})
	
	
}