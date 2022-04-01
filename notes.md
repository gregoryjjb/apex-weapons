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


## Devotion

The curve is too complicated to reverse engineer. According to the wiki it ramps up from 300-900 RPM, this does match the data I found by video.

Frames at which shots occurred (no turbocharger):

```
# Raw:
555, 579, 599, 616, 631, 645, 658, 670, 682, 692, 703, 713, 722, 731, 741, 749, 758, 766, 774, 782, 789, 798, 807, 814, 822, 830, 838, 846, 854, 862, 870, 878, 886, 894, 902, 909, 918, 927, 935, 943, 951, 959, 966, 974, 983, 990, 998, 1006

# Normalized:
0, 24, 44, 61, 76, 90, 103, 115, 127, 137, 148, 158, 167, 176, 186, 194, 203, 211, 219, 227, 234, 243, 252, 259, 267, 275, 283, 291, 299, 307, 315, 323, 331, 339, 347, 354, 363, 372, 380, 388, 396, 404, 411, 419, 428, 435, 443, 451
```

With turbocharger:
```
# Raw:
356, 374, 389, 402, 414, 424, 434, 442, 452, 460, 468, 476, 484, 492, 500, 508, 516, 524, 532, 540, 548, 556, 565, 573, 580, 588, 596, 604, 612, 620, 628, 637, 644, 652, 659, 668, 676, 684, 692, 699, 707, 716, 723, 732, 739, 747, 756, 764

# Normalized:
0, 18, 33, 46, 58, 68, 78, 86, 96, 104, 112, 120, 128, 136, 144, 152, 160, 168, 176, 184, 192, 200, 209, 217, 224, 232, 240, 248, 256, 264, 272, 281, 288, 296, 303, 312, 320, 328, 336, 343, 351, 360, 367, 376, 383, 391, 400, 408
```
