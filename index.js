String.prototype.clr = function(hex_color) { return `<font color='#${hex_color}'>${this}</font>`; };

const clr1 = '009dff';
const clr2 = 'f2881e';
const clr3 = '1ef232';

const aura_amp = [1, 1.02, 1.025, 1.03, 1.035, 1.04];
const aura_pierce = [0, 667, 833, 1000, 1167, 1335];
const aura_pres = [1, 1.02, 1.025, 1.03, 1.035, 1.04];
const aura_mres = [1, 1.02, 1.025, 1.03, 1.035, 1.04];

const servers = {"Yurian": 28, "Mystel": 38, "Seren": 29, "Shakan": 40, "Shen": 39, "Velik": 43, "Kaia": 42};
const classes = [["Warrior", "phys"], ["Lancer", "phys"], ["Slayer", "phys"], ["Berserker", "phys"], ["Sorcerer", "mag"], ["Archer", "phys"], ["Priest", "mag"], ["Mystic", "mag"], ["Reaper", "mag"], ["Gunner", "mag"], ["Brawler", "phys"], ["Ninja", "mag"], ["Valkyrie", "phys"]];

const jewels = [90170, 90171, 90172, 90173, 90174, 90175, 90176, 90177];
const circlets = [90176, 90177];
const new_p_amp = {'5200001': 1365, '5200002': 1624, '5200003': 1931, '5200004': 2297, '5200005': 2730};
const new_p_cp = {'5200011': 0.018, '5200012': 0.021, '5200013': 0.025, '5200014': 0.029, '5200015': 0.035};
const new_p_res = {'5200021': 0.018, '5200022': 0.021, '5200023': 0.025, '5200024': 0.029, '5200025': 0.035};
const new_p_pie = {'5200031': 274, '5200032': 325, '5200033': 387, '5200034': 460, '5200035': 547};
const new_p_ign = {'5200041': 547, '5200042': 651, '5200043': 774, '5200044': 920, '5200045': 1094};
const new_m_amp = {'5200006': 1365, '5200007': 1624, '5200008': 1931, '5200009': 2297, '5200010': 2730};
const new_m_cp = {'5200016': 0.018, '5200017': 0.021, '5200018': 0.025, '5200019': 0.029, '5200020': 0.035};
const new_m_res = {'5200026': 0.018, '5200027': 0.021, '5200028': 0.025, '5200029': 0.029, '5200030': 0.035};
const new_m_pie = {'5200036': 274, '5200037': 325, '5200038': 387, '5200039': 460, '5200040': 547};
const new_m_ign = {'5200046': 547, '5200047': 651, '5200048': 774, '5200049': 920, '5200050': 1094};

const fearless = [5010471, 5010473, 5010479, 5010480, 5010483, 5010484];
const wise = [5010475, 5010477, 5010481, 5010482, 5010485, 5010486];
const powerEtch = {"4010280": 1,  "4010283": 2, "4010286": 2, "4010289": 2, "4010292": 2, "4010295": 3, "2010298": 3};
const powerCrystal = 8940;
const powerJewels = {"90170": 45, "90171": 45, "90172": 32, "90173": 32, "90174": 42, "90175": 42, "90176": 11, "90177": 11};

module.exports = function Damage(mod){
	
	mod.game.initialize("inventory");
	
	let inv = mod.game.inventory;
	let config = mod.settings;
	
	let requested = false;
	let tankRequested = false;
	let healerRequested = false;
	let hold = false;
	let bonusCritPowerPhysical = 0;
	let bonusCritPowerMagical = 0;
	let bonusDefenseIgnorePhysical = 0;
	let bonusDefenseIgnoreMagical = 0;
	let bonusPiercingPhysical = 0;
	let bonusPiercingMagical = 0;
	let bonusAttackPhysical = 0;
	let bonusAttackMagical = 0;
	let bonusPower = 0;
	
	mod.game.on("leave_game", () => {
		hold = false;
		bonusCritPowerPhysical = 0;
		bonusCritPowerMagical = 0;
		bonusDefenseIgnorePhysical = 0;
		bonusDefenseIgnoreMagical = 0;
		bonusPiercingPhysical = 0;
		bonusPiercingMagical = 0;
		bonusAttackPhysical = 0;
		bonusAttackMagical = 0;
		bonusPower = 0;
	});
	
	mod.command.add('damage', (arg1,arg2,arg3) => {
		if(!arg1){
			requested = true;
			mod.toServer("C_REQUEST_USER_PAPERDOLL_INFO", 4, {
				serverId: mod.game.me.serverId,
				zoom: false,
				name: mod.game.me.name				
			});
		};
		switch(arg1){
			case "boss":
				if(!arg2){
					mod.command.message(`
Boss resist value: ` + `${config.boss_res}`.clr(clr3));
					return;
				};
				if(isNaN(arg2)){
					mod.command.message("Boss resist must be a number".clr(clr2));
					return;
				};
				config.boss_res = parseFloat(arg2);
				mod.command.message(`Boss resist set to ` + `${config.boss_res}`.clr(clr1));
				mod.saveSettings();
				break;
			case "tank":
				if(!arg2){
					mod.command.message(`
Tank: ` + `${config.tank}`.clr(clr3) + `. Tank's ${(config.tank === "brawler" ? "amp" : "resist")}: ` + `${config.tank_res}`.clr(clr3));
					return;
				};
				if(arg2 === "inspect"){
					if(!arg3){
						mod.command.message("Missing name of tank".clr(clr2));
					} else {
						tankRequested = true;
						mod.toServer("C_REQUEST_USER_PAPERDOLL_INFO", 4, {
							serverId: mod.game.me.serverId,
							zoom: false,
							name: arg3				
						});
					};
					return;
				};
				if(!isNaN(arg2)){
					config.tank_res = parseFloat(arg2);
					mod.command.message(`Tank physical ${(config.tank === "brawler" ? "amp" : "resist")} set to ` + `${config.tank_res}`.clr(clr1));
					mod.saveSettings();
					break;
				};
				if(["warrior", "lancer", "brawler"].indexOf(arg2) !== -1){
					config.tank = arg2;
					mod.command.message(`Tank class set to ` + `${config.tank}`.clr(clr1));
					mod.saveSettings();
					break;
				};
				if(isNaN(arg2) && ["warrior", "lancer", "brawler"].indexOf(arg2) === -1){
					mod.command.message("Input must be a number, a tank class: warrior, lancer or brawler, or an inspect request".clr(clr2));
					return;
				};
			case "healer":
				if(!arg2){
					mod.command.message(`
Healer resist: ` + `${config.healer_res}`.clr(clr3));
					return;
				};
				if(arg2 === "inspect"){
					if(!arg3){
						mod.command.message("Missing name of healer".clr(clr2));
					} else {
						healerRequested = true;
						mod.toServer("C_REQUEST_USER_PAPERDOLL_INFO", 4, {
							serverId: mod.game.me.serverId,
							zoom: false,
							name: arg3				
						});
					};
					return;
				};
				if(isNaN(arg2)){
					mod.command.message("Healer magical resist must be a number or an inspect request".clr(clr2));
					return;
				};
				config.healer_res = parseFloat(arg2);
				mod.command.message(`Healer magical resist set to ` + `${config.healer_res}`.clr(clr1));
				mod.saveSettings();
				break;
			case "aura":
				if(!arg2){
					mod.command.message(`
Amplification aura tier: ` + `${config.aura_amp}`.clr(clr3) + `
Pierce aura tier: ` + `${config.aura_pierce}`.clr(clr3) + `
Phys resist aura tier: ` + `${config.aura_pres}`.clr(clr3) + `
Mag resist aura tier: ` + `${config.aura_mres}`.clr(clr3));
					return;
				};
				switch(arg2){
					case "amp":
						if(!arg3){
							mod.command.message(`
Amplification aura tier: ` + `${config.aura_amp}`.clr(clr3));
							return;
						};
						if(["0","1","2","3","4","5"].indexOf(arg3) === -1){
							mod.command.message("Aura tier must be from 0 to 5".clr(clr2));
							return;
						};
						config.aura_amp = parseInt(arg3);
						mod.command.message(`Amp aura set to tier ` + `${config.aura_amp}`.clr(clr1));
						mod.saveSettings();
						break;
					case "pierce":
						if(!arg3){
							mod.command.message(`
Pierce aura tier: ` + `${config.aura_pierce}`.clr(clr3));
							return;
						};
						if(["0","1","2","3","4","5"].indexOf(arg3) === -1){
							mod.command.message("Aura tier must be from 0 to 5".clr(clr2));
							return;
						};
						config.aura_pierce = parseInt(arg3);
						mod.command.message(`Pierce aura set to tier ` + `${config.aura_pierce}`.clr(clr1));
						mod.saveSettings();
						break;
					case "pres":
						if(!arg3){
							mod.command.message(`
Phys resist aura tier: ` + `${config.aura_pres}`.clr(clr3));
							return;
						};
						if(["0","1","2","3","4","5"].indexOf(arg3) === -1){
							mod.command.message("Aura tier must be from 0 to 5".clr(clr2));
							return;
						};
						config.aura_pres = parseInt(arg3);
						mod.command.message(`Phys res aura set to tier ` + `${config.aura_pres}`.clr(clr1));
						mod.saveSettings();
						break;
					case "mres":
						if(!arg3){
							mod.command.message(`
Mag resist aura tier: ` + `${config.aura_mres}`.clr(clr3));
							return;
						};
						if(["0","1","2","3","4","5"].indexOf(arg3) === -1){
							mod.command.message("Aura tier must be from 0 to 5".clr(clr2));
							return;
						};
						config.aura_mres = parseInt(arg3);
						mod.command.message(`Mag res aura set to tier ` + `${config.aura_mres}`.clr(clr1));
						mod.saveSettings();
						break;
					default:
						mod.command.message("Aura not found. Accepted arguments are amp, pierce, pres and mres".clr(clr2));
				};
				break;
			case "wine":
				if(!arg2){
					mod.command.message(`
Wine for self is ` + `${(config.wine_me ? "enabled" : "disabled")}`.clr(clr3) + `
Wine for tank is ` + `${(config.wine_tank ? "enabled" : "disabled")}`.clr(clr3) + `
Wine for healer is ` + `${(config.wine_healer ? "enabled" : "disabled")}`.clr(clr3));
					return;
				};
				switch(arg2){
					case "self":
					case "me":
						config.wine_me = !config.wine_me;
						mod.command.message(`Wine on self ` + `${(config.wine_me ? "enabled" : "disabled")}`.clr(clr1));
						mod.saveSettings();
						break;
					case "tank":
						config.wine_tank = !config.wine_tank;
						mod.command.message(`Wine on tank ` + `${(config.wine_tank ? "enabled" : "disabled")}`.clr(clr1));
						mod.saveSettings();
						break;
					case "healer":
						config.wine_healer = !config.wine_healer;
						mod.command.message(`Wine on healer ` + `${(config.wine_healer ? "enabled" : "disabled")}`.clr(clr1));
						mod.saveSettings();
						break;
					default:
					mod.command.message("Wine user not found. Accepted arguments are me, self, tank and healer".clr(clr2));
				};
				break;
			case "curse":
				config.cruel_curse = !config.cruel_curse;
				mod.command.message(`Cruel curse ` + `${(config.cruel_curse ? "enabled" : "disabled")}`.clr(clr1));
				mod.saveSettings();
				break;
			case "sentence":
				config.death_sentence = !config.death_sentence;
				mod.command.message(`Death sentence ` + `${(config.death_sentence ? "enabled" : "disabled")}`.clr(clr1));
				mod.saveSettings();
				break;
			case "skill":
				if(!arg2){
					mod.command.message(`
Skill main modifier: ` + `${config.skill_main_mod}%`.clr(clr3) + `
Skill sec modifier: ` + `${config.skill_sec_mod}%`.clr(clr3) + `
Skill crit rate: ` + `${config.crit_rate}%`.clr(clr3));
					return;
				};
				if(!arg3){
					mod.command.message("Missing crit/skill modifier value".clr(clr2));
					return;
				};
				if(isNaN(arg3)){
					mod.command.message("Crit/skill modifier must be a number".clr(clr2));
					return;
				};
				switch(arg2){
					case "main":
						config.skill_main_mod = parseFloat(arg3);
						mod.command.message(`Skill main modifier set to ` + `${config.skill_main_mod}%`.clr(clr1));
						mod.saveSettings();
						break;
					case "sec":
						config.skill_sec_mod = parseFloat(arg3);
						mod.command.message(`Skill secondary modifier set to ` + `${config.skill_sec_mod}%`.clr(clr1));
						mod.saveSettings();
						break;
					case "crit":
						if(arg3 < 0 || arg3 > 100){
							mod.command.message("Crit rate must be between 0 and 100".clr(clr2));
							return;
						};
						config.crit_rate = parseFloat(arg3);
						mod.command.message(`Crit rate set to ` + `${config.crit_rate}%`.clr(clr1));
						mod.saveSettings();
						break;	
					default:
					mod.command.message("Type of skill modifier not found. Accepted arguments are main, sec and crit".clr(clr2));
				};
				break;
			case "resist":
				config.shred = !config.shred;
				mod.command.message(`Resist display ` + `${(config.shred ? "enabled" : "disabled")}`.clr(clr1));
				mod.saveSettings();
				break;
			case "shred":
				let tankShred = 0;
				switch(config.tank){
					case "warrior":
						tankShred = 0.1 * (config.tank_res + (config.wine_tank ? 4000 * 1.25 : 0)) * aura_pres[config.aura_pres];
						break;
					case "lancer":
						tankShred = 0.1 * (config.tank_res + (config.wine_tank ? 4000 * 1.05 : 0)) * aura_pres[config.aura_pres];
						break;
					case "brawler":
						tankShred = 0.05 * (config.tank_res + (config.wine_tank ? 8000 * 1.05 : 0)) * aura_pres[config.aura_amp];
						break;
				}
				let healerShred = 0.1 * (config.healer_res + (config.wine_healer ? 4000 : 0) * 1.05) * aura_mres[config.aura_mres];
				let shred = tankShred + healerShred + (config.death_sentence ? 5000 : 0) + (config.cruel_curse ? 9400 : 0);
				mod.command.message(`Current shred: ` + `${Math.floor(shred)}`.clr(clr1));
				break;
			case "inspect":
				if(!arg2){
					config.auto_inspect = !config.auto_inspect;
					mod.command.message(`Automatic damage modifier calculation on inspection ` + `${(config.auto_inspect ? "enabled" : "disabled")}`.clr(clr1));
					mod.saveSettings();
					return;
				}
				if(!arg3){
					requested = true;
					mod.toServer("C_REQUEST_USER_PAPERDOLL_INFO", 4, {
						serverId: mod.game.me.serverId,
						zoom: false,
						name: arg2				
					});
					return;
				}
				if(["Yurian", "Mystel", "Seren", "Shakan", "Velik", "Kaia", "Shen"].indexOf(arg3) !== -1){
					requested = true;
					mod.toServer("C_REQUEST_USER_PAPERDOLL_INFO", 4, {
						serverId: servers[arg3],
						zoom: false,
						name: arg2				
					});
				} else {
					mod.command.message("The accepted servers are Yurian, Mystel, Seren, Shakan, Velik, Kaia and Shen");
					return;
				};
				break;
			case "power":
				config.power = !config.power;
				mod.command.message(`Using power for damage modifier ` + `${(config.power ? "enabled" : "disabled")}`.clr(clr1));
				mod.saveSettings();
				break;
			case "equip":
				if(!arg2){
					mod.command.message("Missing link of a glimmering ring/earring/neclace/circlet".clr(clr2));
					return;
				};
				get_jewel_per_chat_link(arg2).then( (bonus) => {
					if(!bonus){
						mod.command.message("Link a glimmering ring/earring/neclace/circlet to use this funtion".clr(clr2));
						return;
					};
					arg3 = arg3 ? arg3 : "0";
					switch(arg3){
						case "0":
							update_bonus(bonus[0]);
							requested = true;
							mod.toServer("C_REQUEST_USER_PAPERDOLL_INFO", 4, {
								serverId: mod.game.me.serverId,
								zoom: false,
								name: mod.game.me.name				
							});
							break;
						case "1":
						case "rollback":
							update_bonus(bonus[1]);
							requested = true;
							mod.toServer("C_REQUEST_USER_PAPERDOLL_INFO", 4, {
								serverId: mod.game.me.serverId,
								zoom: false,
								name: mod.game.me.name				
							});
							break;
						default:
							mod.command.message("Use 1 or rollback as argument after link to view previous rolls".clr(clr2));
					};
				});
				break;
			case "add":
				if(!arg2){
					if(!hold){
						mod.command.message(`
Stats holding: ` + `disabled`.clr(clr3))
					} else {
						mod.command.message(`
Stats holding: ` + `enabled`.clr(clr3) + `
Bonus ${classes[mod.game.me.templateId % 100 - 1][1]} cp: ` + `${(classes[mod.game.me.templateId % 100 - 1][1] === "phys" ? bonusCritPowerPhysical : bonusCritPowerMagical)}`.clr(clr3) + `
Bonus ${classes[mod.game.me.templateId % 100 - 1][1]} pierce: ` + `${(classes[mod.game.me.templateId % 100 - 1][1] === "phys" ? bonusPiercingPhysical : bonusPiercingMagical)}`.clr(clr3) + `
Bonus ${classes[mod.game.me.templateId % 100 - 1][1]} ignore: ` + `${(classes[mod.game.me.templateId % 100 - 1][1] === "phys" ? bonusDefenseIgnorePhysical : bonusDefenseIgnoreMagical)}`.clr(clr3) + `
Bonus ${classes[mod.game.me.templateId % 100 - 1][1]} amp: ` + `${(classes[mod.game.me.templateId % 100 - 1][1] === "phys" ? bonusAttackPhysical : bonusAttackMagical)}`.clr(clr3));
						if(config.power){
							mod.command.message(`Bonus power: ` + `${bonusPower}`.clr(clr3));
						};
					};
					return;
				};
				if(arg2 === "hold"){
					hold = !hold;
					mod.command.message("Holding stats : " + `${hold}`.clr(clr1));
					if(!hold){
						bonusCritPowerPhysical = 0;
						bonusCritPowerMagical = 0;
						bonusDefenseIgnorePhysical = 0;
						bonusDefenseIgnoreMagical = 0;
						bonusPiercingPhysical = 0;
						bonusPiercingMagical = 0;
						bonusAttackPhysical = 0;
						bonusAttackMagical = 0;
						bonusPower = 0;
					};
					return;
				};
				if(!arg3){
					mod.command.message("Missing stat value".clr(clr2));
					return;
				} else if(isNaN(arg3)){
					mod.command.message("Stat value must be a number".clr(clr2));
					return;
				};
				switch(arg2){
					case "cp":
						bonusCritPowerPhysical = bonusCritPowerPhysical + (classes[mod.game.me.templateId % 100 - 1][1] === "phys" ? parseFloat(arg3) : 0);
						bonusCritPowerMagical = bonusCritPowerMagical + (classes[mod.game.me.templateId % 100 - 1][1] === "mag" ? parseFloat(arg3) : 0);
						mod.command.message(`
Bonus ${classes[mod.game.me.templateId % 100 - 1][1]} ${arg2} set to: ` + `${(classes[mod.game.me.templateId % 100 - 1][1] === "phys" ? bonusCritPowerPhysical : bonusCritPowerMagical)}`.clr(clr1));
						break;
					case "pierce":
						bonusPiercingPhysical = bonusPiercingPhysical + (classes[mod.game.me.templateId % 100 - 1][1] === "phys" ? parseFloat(arg3) : 0);
						bonusPiercingMagical = bonusPiercingMagical + (classes[mod.game.me.templateId % 100 - 1][1] === "mag" ? parseFloat(arg3) : 0);
						mod.command.message(`
Bonus ${classes[mod.game.me.templateId % 100 - 1][1]} ${arg2} set to: ` + `${(classes[mod.game.me.templateId % 100 - 1][1] === "phys" ? bonusPiercingPhysical : bonusPiercingMagical)}`.clr(clr1));
						break;
					case "ignore":
						bonusDefenseIgnorePhysical = bonusDefenseIgnorePhysical + (classes[mod.game.me.templateId % 100 - 1][1] === "phys" ? parseFloat(arg3) : 0);
						bonusDefenseIgnoreMagical = bonusDefenseIgnoreMagical + (classes[mod.game.me.templateId % 100 - 1][1] === "mag" ? parseFloat(arg3) : 0);
						mod.command.message(`
Bonus ${classes[mod.game.me.templateId % 100 - 1][1]} ${arg2} set to: ` + `${(classes[mod.game.me.templateId % 100 - 1][1] === "phys" ? bonusDefenseIgnorePhysical : bonusDefenseIgnoreMagical)}`.clr(clr1));
						break;
					case "amp":
						bonusAttackPhysical = bonusAttackPhysical + (classes[mod.game.me.templateId % 100 - 1][1] === "phys" ? parseFloat(arg3) : 0);
						bonusAttackMagical = bonusAttackMagical + (classes[mod.game.me.templateId % 100 - 1][1] === "mag" ? parseFloat(arg3) : 0);
						mod.command.message(`
Bonus ${classes[mod.game.me.templateId % 100 - 1][1]} ${arg2} set to: ` + `${(classes[mod.game.me.templateId % 100 - 1][1] === "phys" ? bonusAttackPhysical : bonusAttackMagical)}`.clr(clr1));
						break;
					case "power":
						if(!config.power){
							mod.command.message("Using power for damage calculation is disabled. Please enable it first".clr(clr2));
						};
						bonusPower = bonusPower + parseFloat(arg3);
						mod.command.message(`
Bonus power set to: ` + `${bonusPower}`.clr(clr1));
						break;
					default:
						mod.command.message("Stat not found. Accepted arguments are cp, pierce, ignore, amp".clr(clr2));
				};
				if(!hold){
					requested = true;
					mod.toServer("C_REQUEST_USER_PAPERDOLL_INFO", 4, {
						serverId: mod.game.me.serverId,
						zoom: false,
						name: mod.game.me.name				
					});
				};
				break;
			default:
				if(arg1){
					mod.command.message("Command not found. Accepted are boss, tank, healer, aura, wine, curse, sentence, skill, resist, shred, inspect, power, equip and add".clr(clr2));
					return;
				};
		};
	});
	
	
	mod.hook("S_USER_PAPERDOLL_INFO", 15, (event) => {
		if(tankRequested){
			if(["Warrior", "Brawler", "Lancer"].indexOf(classes[event.templateId % 100 - 1][0]) === -1){
				mod.command.message("Tank must be a warrior, a brawler or a lancer".clr(clr2));
				tankRequested = false;
				return false;
			};
			config.tank = classes[event.templateId % 100 - 1][0].toLowerCase();
			mod.command.message(`Tank class set to ` + `${config.tank}`.clr(clr1));
			if(["Warrior", "Lancer"].indexOf(classes[event.templateId % 100 - 1][0]) !== -1){
				config.tank_res = event.defensePhysical + event.defensePhysicalBonus;
				mod.command.message(`Tank physical resist set to ` + `${config.tank_res}`.clr(clr1));
			} else {
				config.tank_res = event.attackPhysicalMin + event.attackPhysicalMinBonus;
				mod.command.message(`Tank physical amp set to ` + `${config.tank_res}`.clr(clr1));
			};
			mod.saveSettings();
			tankRequested = false;
			return false;
		};
		if(healerRequested){
			if(["Priest", "Mystic"].indexOf(classes[event.templateId % 100 - 1][0]) === -1){
				mod.command.message("Healer must be a priest or a mystic".clr(clr2));
				healerRequested = false;
				return false;
			};
			config.healer_res = event.defenseMagical + event.defenseMagicalBonus;
			mod.command.message(`Healer magical resist set to ` + `${config.healer_res}`.clr(clr1));
			mod.saveSettings();
			healerRequested = false;
			return false;
		};
		if(requested || config.auto_inspect){
			
			if(hold && event.gameId !== mod.game.me.gameId){
				mod.command.message(`Adding stats for other players is not currently supported. Results will only be right for ${classes[mod.game.me.templateId % 100 - 1][1]} classes`.clr(clr2));
			};
			
			if(config.wine_me){
				if(classes[event.templateId % 100 - 1][1] === "phys"){
					bonusCritPowerPhysical = bonusCritPowerPhysical + 0.05;
					bonusAttackPhysical = bonusAttackPhysical + 8000;
				} else if (classes[event.templateId % 100 - 1][1] === "mag"){
					bonusCritPowerMagical = bonusCritPowerMagical + 0.05;
					bonusAttackMagical = bonusAttackMagical + 8000;
				};
			};
			
			let critPower = event.critPower + event.critPowerBonus;
			let critPowerPhysical = event.critPowerPhysical + event.critPowerPhysicalBonus + bonusCritPowerPhysical;
			let critPowerMagical = event.critPowerMagical + event.critPowerMagicalBonus + bonusCritPowerMagical;
			let defenseIgnorePhysical = event.defenseReductionPhysical+ event.defenseReductionPhysicalBonus + bonusDefenseIgnorePhysical;
			let defenseIgnoreMagical = event.defenseReductionMagical + event.defenseReductionMagicalBonus + bonusDefenseIgnoreMagical;
			let piercingPhysical = event.piercingPhysical + event.piercingPhysicalBonus + bonusPiercingPhysical;
			let piercingMagical = event.piercingMagical + event.piercingMagicalBonus + bonusPiercingMagical;
			let attackPhysical = event.attackPhysicalMin + event.attackPhysicalMinBonus + bonusAttackPhysical;
			let attackMagical = event.attackMagicalMin + event.attackMagicalMinBonus + bonusAttackMagical;
			
			switch(classes[event.templateId % 100 - 1][0]){
				case "Warrior":
					defenseIgnorePhysical = defenseIgnorePhysical + bonusCritPowerPhysical * 15000;
					break;
				case "Slayer":
					defenseIgnorePhysical = defenseIgnorePhysical + bonusAttackPhysical * 0.04;
					defenseIgnorePhysical = defenseIgnorePhysical + 0.02 * attackPhysical;
					break;
				case "Archer":
					piercingPhysical = piercingPhysical + bonusCritPowerPhysical * (mod.majorPatchVersion >= 111 ? 2500 : 5000);
					break;
				case "Reaper":
					defenseIgnoreMagical = defenseIgnoreMagical + bonusAttackMagical * 0.04;
					defenseIgnoreMagical = defenseIgnoreMagical + 0.02 * attackMagical;
					break;
				case "Ninja":
					piercingMagical = piercingMagical + bonusAttackMagical * 0.01;
					break;
				case "Brawler":
					attackPhysical = attackPhysical + bonusAttackPhysical * 0.05;
					break;
				default:
					mod.command.message(`${classes[event.templateId % 100 - 1][0]} passive is currently not supported`);
			};
			
			attackPhysical = attackPhysical * aura_amp[config.aura_amp];
			attackMagical = attackMagical * aura_amp[config.aura_amp];
			piercingPhysical = piercingPhysical + aura_pierce[config.aura_pierce];
			piercingMagical = piercingMagical + aura_pierce[config.aura_pierce];
			
			let tankShred = 0;
			switch(config.tank){
				case "warrior":
					tankShred = 0.1 * (config.tank_res + (config.wine_tank ? 4000 * 1.25 : 0)) * aura_pres[config.aura_pres];
					break;
				case "lancer":
					tankShred = 0.1 * (config.tank_res + (config.wine_tank ? 4000 * 1.05 : 0)) * aura_pres[config.aura_pres];
					break;
				case "brawler":
					tankShred = 0.05 * (config.tank_res + (config.wine_tank ? 8000 * 1.05 : 0)) * aura_pres[config.aura_amp];
					break;
			}
			let healerShred = 0.1 * (config.healer_res + (config.wine_healer ? 4000 : 0) * 1.05) * aura_mres[config.aura_mres];
			
			let piercingPhysicalMultiplier = Math.min( piercingPhysical / (10000 + piercingPhysical), 0.8 );
			let piercingMagicalMultiplier = Math.min( piercingMagical / (10000 + piercingMagical), 0.8 );
			
			let bossPhysicalDefense = config.boss_res * (1 - piercingPhysicalMultiplier) - tankShred - healerShred - defenseIgnorePhysical - (config.death_sentence ? 5000 : 0) - (config.cruel_curse ? 9400 : 0);
			let bossMagicalDefense = config.boss_res * (1 - piercingMagicalMultiplier) - tankShred - healerShred - defenseIgnoreMagical - (config.death_sentence ? 5000 : 0) - (config.cruel_curse ? 9400 : 0);
			
			let bossPhysicalDefenseCapped = Math.max( bossPhysicalDefense, -33333);
			let bossMagicalDefenseCapped = Math.max( bossMagicalDefense, -33333);
			
			let physicalModifier = attackPhysical * (classes[event.templateId % 100 - 1][1] === "phys" ? config.skill_main_mod : config.skill_sec_mod) / 100 / (100000 + bossPhysicalDefenseCapped);
			let magicalModifier = attackMagical * (classes[event.templateId % 100 - 1][1] === "mag" ? config.skill_main_mod : config.skill_sec_mod) / 100 / (100000 + bossMagicalDefenseCapped);
			
			let totalModifier = (0.9 * critPower + physicalModifier * critPowerPhysical  + magicalModifier * critPowerMagical) * config.crit_rate / 100 + (1 - config.crit_rate / 100) * (1 + physicalModifier + magicalModifier);
			
			let powerFactor = (1 + (event.powerBonus + bonusPower) / (100 + event.power)) * (3 + 0.03 * event.power);
			
			totalModifier = totalModifier * (config.power ? powerFactor : 1);
			let shortModifier =  Math.round(totalModifier * 100) / 100;
			
			
			if(config.shred){
				if(classes[event.templateId % 100 - 1][1] === "phys"){
					mod.command.message(`
${event.name}`.clr(clr3) +`'s total modifier = ` + `${shortModifier}
`.clr(clr3) + `Boss phys defense = ` + `${Math.ceil(bossPhysicalDefenseCapped)} (${Math.ceil(bossPhysicalDefense)})`.clr(clr3));
				};
				if(classes[event.templateId % 100 - 1][1] === "mag"){
					mod.command.message(`
${event.name}`.clr(clr3) +`'s total modifier = ` + `${shortModifier}
`.clr(clr3) + `Boss phys defense = ` + `${Math.ceil(bossMagicalDefenseCapped)} (${Math.ceil(bossMagicalDefense)})`.clr(clr3));
				};
			} else {
				mod.command.message(`
${event.name}`.clr(clr3) +`'s total modifier = ` + `${shortModifier}`.clr(clr3));
			};
			
			requested = false;
			
			if(!hold){
				bonusCritPowerPhysical = 0;
				bonusCritPowerMagical = 0;
				bonusDefenseIgnorePhysical = 0;
				bonusDefenseIgnoreMagical = 0;
				bonusPiercingPhysical = 0;
				bonusPiercingMagical = 0;
				bonusAttackPhysical = 0;
				bonusAttackMagical = 0;
				bonusPower = 0;
			} else if(config.wine_me){
				if(classes[event.templateId % 100 - 1][1] === "phys"){
					bonusCritPowerPhysical = bonusCritPowerPhysical - 0.05;
					bonusAttackPhysical = bonusAttackPhysical - 8000;
				} else if (classes[event.templateId % 100 - 1][1] === "mag"){
					bonusCritPowerMagical = bonusCritPowerMagical - 0.05;
					bonusAttackMagical = bonusAttackMagical - 8000;
				};
			};
			
			return (event.gameId === mod.game.me.gameId ? false : undefined);
		};
	});
	
	
	async function get_jewel_per_chat_link(chat_link) {
        const expression = /@(\d*)@/;
        const item_dbid = chat_link.match(expression);
        if (item_dbid) {
            let id =  parseInt(item_dbid[1]);
			let item = inv.dbids[id];
			if(!jewels.includes(item.id)){
				return false;
			} else {
				let rolls = item.passivitySets[0].passivities;
				let jewel = {};
				jewel.pcp = rolls.reduce( (prev, cur) => Object.keys(new_p_cp).includes(cur.toString()) ? prev + new_p_cp[cur.toString()] : prev, 0);
				jewel.pignore = rolls.reduce( (prev, cur) => Object.keys(new_p_ign).includes(cur.toString()) ? prev + new_p_ign[cur.toString()] : prev, 0);
				jewel.ppierce = rolls.reduce( (prev, cur) => Object.keys(new_p_pie).includes(cur.toString()) ? prev + new_p_pie[cur.toString()] : prev, 0);
				jewel.pamp = rolls.reduce( (prev, cur) => Object.keys(new_p_amp).includes(cur.toString()) ? prev + new_p_amp[cur.toString()] : prev, 0);
				jewel.mcp = rolls.reduce( (prev, cur) => Object.keys(new_m_cp).includes(cur.toString()) ? prev + new_m_cp[cur.toString()] : prev, 0);
				jewel.mignore = rolls.reduce( (prev, cur) => Object.keys(new_m_ign).includes(cur.toString()) ? prev + new_m_ign[cur.toString()] : prev, 0);
				jewel.mpierce = rolls.reduce( (prev, cur) => Object.keys(new_m_pie).includes(cur.toString()) ? prev + new_m_pie[cur.toString()] : prev, 0);
				jewel.mamp = rolls.reduce( (prev, cur) => Object.keys(new_m_amp).includes(cur.toString()) ? prev + new_m_amp[cur.toString()] : prev, 0);
				jewel.power = powerJewels[item.id.toString()];
				
				let rolls1 = item.passivitySets[1].passivities;
				let jewel1 = {};
				jewel1.pcp = rolls1.reduce( (prev, cur) => Object.keys(new_p_cp).includes(cur.toString()) ? prev + new_p_cp[cur.toString()] : prev, 0);
				jewel1.pignore = rolls1.reduce( (prev, cur) => Object.keys(new_p_ign).includes(cur.toString()) ? prev + new_p_ign[cur.toString()] : prev, 0);
				jewel1.ppierce = rolls1.reduce( (prev, cur) => Object.keys(new_p_pie).includes(cur.toString()) ? prev + new_p_pie[cur.toString()] : prev, 0);
				jewel1.pamp = rolls1.reduce( (prev, cur) => Object.keys(new_p_amp).includes(cur.toString()) ? prev + new_p_amp[cur.toString()] : prev, 0);
				jewel1.mcp = rolls1.reduce( (prev, cur) => Object.keys(new_m_cp).includes(cur.toString()) ? prev + new_m_cp[cur.toString()] : prev, 0);
				jewel1.mignore = rolls1.reduce( (prev, cur) => Object.keys(new_m_ign).includes(cur.toString()) ? prev + new_m_ign[cur.toString()] : prev, 0);
				jewel1.mpierce = rolls1.reduce( (prev, cur) => Object.keys(new_m_pie).includes(cur.toString()) ? prev + new_m_pie[cur.toString()] : prev, 0);
				jewel1.mamp = rolls1.reduce( (prev, cur) => Object.keys(new_m_amp).includes(cur.toString()) ? prev + new_m_amp[cur.toString()] : prev, 0);
				jewel1.power = powerJewels[item.id.toString()];
				
				if(item.crystals.length === 1 && item.crystals[0] === powerCrystal){
					jewel.power = jewel.power + 3;
					jewel1.power = jewel1.power + 3;
				};
				
				if(item.hasEtching){
					let promise = new Promise((resolve, reject) => {
						mod.hookOnce("S_SHOW_ITEM_TOOLTIP", 17, (event) =>{
							let etching = event.etching1;
							if(fearless.includes(etching)){
								jewel.pcp = jewel.pcp + 0.015;
								jewel.pamp = jewel.pamp + 983;
								jewel1.pcp = jewel1.pcp + 0.015;
								jewel1.pamp = jewel1.pamp + 983;
							} else if(wise.includes(etching)){
								jewel.mcp = jewel.mcp + 0.015;
								jewel.mamp = jewel.mamp + 983;
								jewel1.mcp = jewel1.mcp + 0.015;
								jewel1.mamp = jewel1.mamp + 983;
							} else if(Object.keys(powerEtch).includes(etching.toString())){
								jewel.power = jewel.power + powerEtch[etching.toString()];
								jewel1.power = jewel1.power + powerEtch[etching.toString()];
							};
							resolve(undefined);
							return false;
						});
					});
					mod.toServer("C_SHOW_ITEM_TOOLTIP_EX", 6, {
						type: 22,
						dbid: parseInt(item_dbid[1]),
						extraValue: 0n,
						owner: {serverId: 0, playerId: mod.game.me.playerId, name: mod.game.me.name}
					});
					await promise;
				};
				return [jewel, jewel1];
			};
		} else {
			return false;
		};
    };
	
	function update_bonus(jewel){
		bonusCritPowerPhysical = jewel.pcp;
		bonusCritPowerMagical = jewel.mcp;
		bonusDefenseIgnorePhysical = jewel.pignore;
		bonusDefenseIgnoreMagical = jewel.mignore;
		bonusPiercingPhysical = jewel.ppierce;
		bonusPiercingMagical = jewel.mpierce;
		bonusAttackPhysical = jewel.pamp;
		bonusAttackMagical = jewel.mamp;
		bonusPower = jewel.power;
	};
};