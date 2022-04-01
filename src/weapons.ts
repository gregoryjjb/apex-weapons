// import { rpmVariants } from "./data";
import { AmmoType } from './types';

import type { DamageCurve, DamageCurveSet, Weapon } from './types';

const round = n => Math.round(n * 10000) / 10000;
const simple = (
  damage: number,
  rpm: number,
  magazineSize: number,
  delay: number = 0
): DamageCurve => {
  const deltaSeconds = (1 / rpm) * 60;

  const damageOverTime: DamageCurve = [];

  for (let i = 0; i < magazineSize; i++) {
    const time = round(deltaSeconds * i) + delay;
    const cumDamage = round(damage * (i + 1));

    damageOverTime.push([time, cumDamage]);
  }

  return damageOverTime;
};

const burst = (
  damage: number,
  rpm: number,
  burstSize: number,
  burstDelay: number,
  burstCount: number
) => {
  const points: DamageCurve = [];

  const deltaSeconds = (1 / rpm) * 60;
  let cumDamage = 0;

  for (let i = 0; i < burstCount; i++) {
    const burst: DamageCurve = [];
    const burstStartedAt =
      points.length > 0 ? points[points.length - 1][0] + burstDelay : 0;

    for (let j = 0; j < burstSize; j++) {
      const time = round(deltaSeconds * j) + burstStartedAt;
      cumDamage += damage;
      burst.push([time, cumDamage]);
    }

    points.push(...burst);
  }

  return points;
};

/**
 * Take the exact frames of a video (starting at zero) the gun shot at and
 * turn it into a damage curve
 * @param frames array of video frame numbers
 * @param damage damage the weapon does per shot
 * @returns the damage curve
 */
const fromFrames = (frames: number[], damage: number, fps: number = 120): DamageCurve => {
  const curve: DamageCurve = [];
  let cumDamage = 0;
  let frameTime = 1 / fps;

  for (let frame of frames) {
    cumDamage += damage;
    const time = frameTime * frame;
    curve.push([time, cumDamage]);
  }

  return curve;
};

type VariantSet = {
  base: number;
  [optional: string]: number;
};
export const rpmVariants =
  (damage: number, magazineSize: number) =>
  (rpmMap: VariantSet): DamageCurveSet => {
    const result: DamageCurveSet = { base: [] };

    Object.keys(rpmMap).forEach(name => {
      result[name] = simple(damage, rpmMap[name], magazineSize);
    });

    return result;
  };

export type WeaponSelections = {
  [key in WeaponKey]: {
    enabled: boolean;
    options: {
      base: boolean;
      [opt: string]: boolean;
    };
  };
};

// See bottom of file for reserved words!
const weaponsTemp: Record<string, Weapon> = {
  // Light
  r301: {
    name: 'R-301 Carbine',
    ammo: AmmoType.Light,
    curves: {
      purple: simple(14, 810, 28),
      // anvil: simple(2.5 * 14, ) what is RPM in anvil?
    },
    headshot: 1.75,
  },
  r99: {
    name: 'R-99 SMG',
    ammo: AmmoType.Light,
    curves: {
      purple: simple(11, 1080, 27),
    },
    headshot: 1.5,
  },
  alternator: {
    name: 'Alternator SMG',
    ammo: AmmoType.Light,
    curves: {
      purple: simple(16, 600, 27),
    },
    curveName: key => `vs ${key} shield`,
    headshot: 1.5,
  },
  re45: {
    name: 'RE-45 Auto',
    ammo: AmmoType.Light,
    curves: {
      base: simple(12, 780, 25),
    },
    headshot: 1.5,
  },
  p2020: {
    name: 'P2020',
    ammo: AmmoType.Light,
    curves: {
      base: simple(18, 420, 21),
    },
    headshot: 1.5,
  },
  // Heavy
  flatline: {
    name: 'VK-47 Flatline',
    ammo: AmmoType.Heavy,
    magazineSizes: {
      base: 20,
      white: 25,
      blue: 28,
      purple: 30,
    },
    curves: {
      purple: simple(18, 600, 30),
    },
    headshot: 1.75,
  },
  wingman: {
    name: 'Wingman',
    ammo: AmmoType.Heavy,
    curves: {
      purple: simple(45, 156, 9),
    },
    headshot: 2.15,
  },
  prowler: {
    name: 'Prowler Burst PDW',
    ammo: AmmoType.Heavy,
    curves: {
      purple: burst(14, 1260, 5, 0.24, 7),
    },
    headshot: 1.5,
  },
  car: {
    name: 'C.A.R. SMG',
    ammo: AmmoType.Heavy,
    curves: {
      purple: simple(13, 930, 27),
    },
    headshot: 1.5,
  },
  hemlock: {
    name: 'Hemlock Burst AR',
    ammo: AmmoType.Heavy,
    curves: {
      purple: burst(20, 930, 3, 0.28, 10),
    },
    headshot: 1.75,
  },
  rampage: {
    name: 'Rampage',
    ammo: AmmoType.Heavy,
    curves: {
      base: simple(26, 300, 40),
      revved: simple(26, 390, 40),
    },
    curveName: key => (key === 'revved' ? 'revved up' : 'base'),
    headshot: 1.5,
  },
  '3030': {
    name: '3030 Repeater',
    ammo: AmmoType.Heavy,
    curves: {
      base: simple(42, 139, 12),
      charged: simple(57, 55.56, 12),
    },
    headshot: 1.75,
  },
  // Energy
  havoc: {
    name: 'HAVOC Rifle',
    ammo: AmmoType.Energy,
    // magazineSizes: {},
    curves: {
      base: simple(18, 672, 24, 0.5),
      turbo: simple(18, 672, 24, 0),
    },
    curveName: key => (key === 'turbo' ? 'turbocharged' : key),
    headshot: 1.75,
  },
  devotion: {
    name: 'Devotion LMG',
    ammo: AmmoType.Energy,
    curves: {
      base: fromFrames(
        [
          0, 24, 44, 61, 76, 90, 103, 115, 127, 137, 148, 158, 167, 176, 186,
          194, 203, 211, 219, 227, 234, 243, 252, 259, 267, 275, 283, 291, 299,
          307, 315, 323, 331, 339, 347, 354, 363, 372, 380, 388, 396, 404, 411,
          419, 428, 435, 443, 451,
        ],
        16
      ),
      turbo: fromFrames(
        [
          0, 18, 33, 46, 58, 68, 78, 86, 96, 104, 112, 120, 128, 136, 144, 152,
          160, 168, 176, 184, 192, 200, 209, 217, 224, 232, 240, 248, 256, 264,
          272, 281, 288, 296, 303, 312, 320, 328, 336, 343, 351, 360, 367, 376,
          383, 391, 400, 408,
        ],
        16
      ),
    },
    headshot: 1.75,
  },
  lstar: {
    name: 'L-STAR EMG',
    ammo: AmmoType.Energy,
    curves: {
      purple: simple(17, 600, 26),
    },
    headshot: 1.75,
  },
  tripleTake: {
    name: 'Triple Take',
    ammo: AmmoType.Energy,
    curves: {
      purple: simple(63, 72, 9),
    },
    headshot: 1.75,
  },
  // Shotguns
  eva8: {
    name: 'EVA-8 Auto',
    ammo: AmmoType.Shotgun,
    curves: rpmVariants(
      63,
      8
    )({
      base: 120,
      white: 132,
      blue: 138,
      purple: 144,
    }),
    curveName: key => `${key} bolt`,
    headshot: 1.25,
  },
  peacekeeper: {
    name: 'Peacekeeper',
    ammo: AmmoType.Shotgun,
    curves: rpmVariants(
      99,
      5
    )({
      base: 44,
      white: 47,
      blue: 50,
      purple: 51,
    }),
    curveName: key => `${key} bolt`,
    headshot: 1.25,
  },
  mastiff: {
    name: 'Mastiff Shotgun',
    ammo: AmmoType.Shotgun,
    curves: rpmVariants(
      11 * 8,
      6
    )({
      base: 66,
      white: 73,
      blue: 76,
      purple: 79,
    }),
    curveName: key => `${key} bolt`,
    headshot: 1.25,
  },
  mozambique: {
    name: 'Mozambique Shotgun',
    ammo: AmmoType.Shotgun,
    curves: rpmVariants(
      15 * 3,
      6
    )({
      base: 138,
      white: 152,
      blue: 165,
      purple: 179,
    }),
    curveName: key => `${key} bolt`,
    headshot: 1.25,
  },
  // Snipers
  chargeRifle: {
    name: 'Charge Rifle',
    ammo: AmmoType.Sniper,
    curves: {
      base: (() => {
        const curve: DamageCurve = [];
        let cumDamage = 0;
        let beamStartTime = 0;

        for (let i = 0; i < 4; i++) {
          // Charge
          for (let j = 0; j < 15; j++) {
            const time = beamStartTime + 0.033 * j; // "sustained_discharge_pulse_frequency"
            cumDamage += 3;
            curve.push([time, cumDamage]);
          }

          // Beam
          beamStartTime += 0.48; // "sustained_discharge_duration"
          cumDamage += 45;
          curve.push([beamStartTime, cumDamage]);

          beamStartTime += 0.92 + 0.1; // charge_cooldown_time + charge_cooldown_delay
        }

        return curve;
      })(),
    },
    headshot: 1.25,
  },
  longbow: {
    name: 'Longbow DMR',
    ammo: AmmoType.Sniper,
    curves: {
      purple: simple(55, 78, 12),
    },
    headshot: 2.15,
  },
  sentinel: {
    name: 'Sentinel',
    ammo: AmmoType.Sniper,
    curves: {
      purple: simple(70, 31, 7),
    },
    headshot: 2,
  },
  // Care package weapons
  kraber: {
    name: 'Kraber .50-Cal Sniper',
    ammo: AmmoType.Heirloom,
    curves: {
      base: simple(145, 25, 4),
    },
    headshot: 3,
  },
  spitfire: {
    name: 'Spitfire',
    ammo: AmmoType.Heirloom,
    curves: {
      purple: simple(19, 540, 55),
    },
    headshot: 1.75,
  },
  g7: {
    // @TODO: add double tap
    name: 'G7 Scout',
    ammo: AmmoType.Heirloom,
    curves: {
      purple: simple(36, 240, 20),
    },
    headshot: 2,
  },
  volt: {
    name: 'Volt SMG',
    ammo: AmmoType.Heirloom,
    curves: {
      purple: simple(17, 720, 26),
    },
    headshot: 1.5,
  },
} as const;

export type WeaponKey = keyof typeof weaponsTemp;

const weapons: Record<WeaponKey, Weapon> = weaponsTemp;
export default weapons;

// Validate Weapons config; some words are reserved!
// @TODO only do this in development somehow?
const reservedCurves = ['b', 'w', 'bl', 'p'];
const alphanum = /^[a-z0-9]+$/i;

let k: WeaponKey;
for (k in weapons) {
  const weapon = weapons[k];

  if (!k.match(alphanum)) {
    throw new Error(`Weapon '${k}' must be only alphanumeric characters`);
  }

  for (let c in weapon.curves) {
    if (!c.match(alphanum)) {
      throw new Error(
        `Curve name '${c}' on weapon '${k}' must be only alphanumeric characters`
      );
    }

    if (reservedCurves.includes(c)) {
      throw new Error(
        `Reserved word '${c}' used as curve key in weapon '${k}'`
      );
    }
  }
}
