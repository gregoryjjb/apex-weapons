# Weapon timing investigations

Several weapons in Apex have complicated firing patterns, making it impossible to determine exact timings from reading game files. I recorded footage of the weapons at 120fps and counted the frames between events to find the meaning of the numbers.

Video footage is imperfect on its own, since even 120fps is still very "coarse" at ~8ms between frames. Using a combination of the game file numbers and the video frame counts gets us pretty much exactly there.


## Charge Rifle

```
// Behavior
"fire_rate"   									"0.95"
...
// Sustained Discharge
"sustained_discharge_duration"	                "0.48" //"1.25"
"sustained_discharge_pulse_frequency"			"0.033" //"0.104"
...
"charge_cooldown_time"							"0.92"
"charge_cooldown_delay"   						"0.1"
```

### Video measurements

**123 frames (1.025s) from pulse fired -> next charge started**

This is roughly identical to the sum of `charge_cooldown_time` and `charge_cooldown_delay` (1.02) so I'm assuming that's what those refer to.

**57 frames (0.475s) from charge-up started to charge-up completed**

This is roughly identical to `sustained_discharge_duration`.

**185 frames (1.54s) from pulse-to-pulse**

The sum of `sustained_discharge_duration`, `charge_cooldown_delay`, and `charge_cooldown_time` is exactly 1.5.

`fire_rate` seems to be completely irrelevant for this weapon; it doesn't fit in anywhere.

### Final numbers

- **0.48s** charge-up time
- **1.02** cooldown time
- **1.50s** time between shots


## 3030 Repeater

```
"fire_rate"                                "3.85"

"rechamber_time"                               "0.685"

"charge_time" 									".35"
"charge_levels"									"2"
"charge_level_base"								"1"
"charge_additional_damage_multiplier"			"0.36" // Damage will range between near_value and (near_value + near_value*chargeFrac*charge_additional_damage_multiplier)

"charge_cooldown_time"							"0.01"
"charge_cooldown_delay"   						"0.0"

"charge_is_triggered_by_ADS"					"1"
"charge_delay_when_triggered_by_ADS"			"0.3" //Delay after entering ads and after every shot in ads
"charge_fraction_scales_anim_rate"				"1"
"charge_end_forces_fire"						"0"
"charge_remain_full_when_fired"                 "0"
```

WIP
