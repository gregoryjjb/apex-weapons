// import { rpmVariants } from "./data";
import { AmmoType } from "./types";

import type { DamageCurve, DamageCurveSet, Weapon } from "./types";

const round = (n) => Math.round(n * 10000) / 10000;
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
type VariantSet = {
  base: number;
  [optional: string]: number;
};
export const rpmVariants =
  (damage: number, magazineSize: number) =>
  (rpmMap: VariantSet): DamageCurveSet => {
    const result: DamageCurveSet = { base: [] };

    Object.keys(rpmMap).forEach((name) => {
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
    name: "R-301 Carbine",
    ammo: AmmoType.Light,
    curves: {
      purple: simple(14, 810, 28),
      // anvil: simple(2.5 * 14, ) what is RPM in anvil?
    },
  },
  r99: {
    name: "R-99 SMG",
    ammo: AmmoType.Light,
    curves: {
      purple: simple(11, 1080, 27),
    },
  },
  // Heavy
  flatline: {
    name: "VK-47 Flatline",
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
    name: "Wingman",
    ammo: AmmoType.Heavy,
    curves: {
      purple: simple(45, 156, 9),
    },
  },
  // Energy
  havoc: {
    name: "HAVOC",
    ammo: AmmoType.Energy,
    // magazineSizes: {},
    curves: {
      base: simple(18, 672, 24, 0.5),
      turbo: simple(18, 672, 24, 0),
    },
    curveName: key => key === 'turbo' ? 'turbocharged' : key,
  },
  // Shotguns
  eva8: {
    name: "EVA-8 Auto",
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
    name: "Peacekeeper",
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
    name: "Mastiff",
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
    name: 'Mozambique',
    ammo: AmmoType.Shotgun,
    curves: rpmVariants(15 * 3, 6)({
      base: 138,
      white: 152,
      blue: 165,
      purple: 179,
    }),
    curveName: key => `${key} bolt`,
  },
} as const;

export type WeaponKey = keyof typeof weaponsTemp;

const weapons: Record<WeaponKey, Weapon> = weaponsTemp;
export default weapons;
