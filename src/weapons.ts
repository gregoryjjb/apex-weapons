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

const weaponsTemp: Record<string, Weapon> = {
  // Light
  r301: {
    name: 'R-301 Carbine',
    ammo: AmmoType.Light,
    curves: {
      purple: simple(14, 810, 28),
      // anvil: simple(2.5 * 14, ) what is RPM in anvil?
    },
  },
  r99: {
    name: 'R-99 SMG',
    ammo: AmmoType.Light,
    curves: {
      purple: simple(11, 1080, 27),
    },
  },
  g7: {
    name: 'G7 Scout',
    ammo: AmmoType.Light,
    curves: {
      purple: simple(34, 240, 20),
    },
  },
  re45: {
    name: 'RE-45 Auto',
    ammo: AmmoType.Light,
    curves: {
      purple: simple(12, 780, 25),
    },
  },
  p2020: {
    name: 'P2020',
    ammo: AmmoType.Light,
    curves: {
      purple: simple(18, 420, 21),
    },
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
      purple: simple(19, 600, 30),
    },
  },
  wingman: {
    name: 'Wingman',
    ammo: AmmoType.Heavy,
    curves: {
      purple: simple(45, 156, 9),
    },
  },
  prowler: {
    name: 'Prowler Burst PDW',
    ammo: AmmoType.Heavy,
    curves: {
      purple: burst(14, 1260, 5, 0.24, 7),
    },
  },
  hemlock: {
    name: 'Hemlock Burst AR',
    ammo: AmmoType.Heavy,
    curves: {
      purple: burst(20, 930, 3, 0.28, 10),
    },
  },
  rampage: {
    name: 'Rampage',
    ammo: AmmoType.Heavy,
    curves: {
      base: simple(28, 300, 40),
      revved: simple(28, 390, 40),
    },
    curveName: key => (key === 'revved' ? 'revved up' : 'base'),
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
  },
  volt: {
    name: 'Volt SMG',
    ammo: AmmoType.Energy,
    curves: {
      purple: simple(15, 720, 26),
    },
  },
  lstar: {
    name: 'L-STAR EMG',
    ammo: AmmoType.Energy,
    curves: {
      purple: simple(18, 600, 26),
    },
  },
  // Shotguns
  eva8: {
    name: 'EVA-8 Auto',
    ammo: AmmoType.Shotgun,
    curves: rpmVariants(
      63,
      8
    )({
      base: 126,
      white: 139,
      blue: 145,
      purple: 151,
    }),
    curveName: key => `${key} bolt`,
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
  },
  // Snipers
  chargeRifle: {
    name: 'Charge Rifle',
    ammo: AmmoType.Sniper,
    curves: {
      base: simple(90, 26, 4),
    },
  },
  longbow: {
    name: 'Longbow DMR',
    ammo: AmmoType.Sniper,
    curves: {
      purple: simple(60, 78, 12),
    },
  },
  sentinel: {
    name: 'Sentinel',
    ammo: AmmoType.Sniper,
    curves: {
      purple: simple(70, 31, 7),
    },
  },
  // Care package weapons
  kraber: {
    name: 'Kraber .50-Cal Sniper',
    ammo: AmmoType.Heirloom,
    curves: {
      base: simple(145, 25, 4),
    },
  },
  alternator: {
    name: 'Alternator SMG',
    ammo: AmmoType.Heirloom,
    curves: {
      base: [
        [0, 22],
        [0.1, 44],
        [0.2, 66],
        [0.3, 88],
        [0.4, 100],
        [0.5, 122],
        [0.6, 144],
      ] as DamageCurve,
    },
  },
  spitfire: {
    name: 'Spitfire',
    ammo: AmmoType.Heirloom,
    curves: {
      purple: simple(19, 540, 55),
    },
  },
  tripleTake: {
    name: 'Triple Take',
    ammo: AmmoType.Heirloom,
    curves: {
      purple: simple(69, 78, 9),
    },
  },
} as const;

export type WeaponKey = keyof typeof weaponsTemp;

const weapons: Record<WeaponKey, Weapon> = weaponsTemp;
export default weapons;
