"use strict"

const DefaultSettings = {
    "tank_res": 241850,
    "healer_res": 285050,
    "boss_res": 92500,
    "aura_amp": 5,
    "aura_pres": 5,
    "aura_mres": 5,
    "aura_pierce": 5,
    "wine_me": true,
    "wine_tank": true,
    "wine_healer": true,
    "cruel_curse": true,
    "death_sentence": true,
    "skill_phys_mod": 180,
    "skill_mag_mod": 36,
    "crit_rate": 100,
    "tank": "warrior",
    "shred": true,
    "auto_inspect": true,
    "power": true
}

module.exports = function MigrateSettings(from_ver, to_ver, settings) {
	if (from_ver === null) { // No config file exists, use default settings
		return DefaultSettings;
	}
	else { // Migrate from older version (using the new system) to latest one
		if(from_ver < to_ver) console.log('Your settings have been updated to version ' + to_ver);
		return Object.assign(DefaultSettings, settings)
		/*
		if (from_ver + 1 < to_ver) { // Recursively upgrade in one-version steps
			settings = MigrateSettings(from_ver, from_ver + 1, settings);
			return MigrateSettings(from_ver + 1, to_ver, settings);
		}
		// If we reach this point it's guaranteed that from_ver === to_ver - 1, so we can implement
		// a switch for each version step that upgrades to the next version. This enables us to
		// upgrade from any version to the latest version without additional effort!
		switch(to_ver) {
			default: // keep old settings, add new ones
				let oldsettings = settings;
				settings = Object.assign(DefaultSettings, {});

				for(let option in oldsettings) {
					if(settings[option]) {
						settings[option] = oldsettings[option];
					}
				}

				if(from_ver < to_ver) mod.log('Your settings have been updated to version ' + to_ver + '. You can edit the new config file after the next relog.');
				break;
		}
		return settings;
		*/
	}
}