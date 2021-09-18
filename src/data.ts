import type { ChartDataset } from "chart.js";
import type { WeaponKey } from "./weapons";
import type { AmmoType, DamageCurve, DamageCurveSet } from './types';

import weapons from "./weapons";

const round = (n) => Math.round(n * 10000) / 10000;

export const simple = (
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

export const magazineVariants = (damage, rpm) => (magMap) => {
  return Object.keys(magMap).map((name) => {
    return {
      name,
      curve: simple(damage, rpm, magMap[name]),
    };
  });
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

export const buildSelectionData = (): WeaponSelections => {
  const selections = {};

  Object.keys(weapons).forEach((key: WeaponKey) => {
    const options = {};
    Object.keys(weapons[key].curves).forEach(
      // Set the first to true, the rest to false
      (option, i) => (options[option] = i === 0)
    );

    selections[key] = {
      enabled: false,
      options,
    };
  });

  // Hacky!!
  let s = selections as WeaponSelections;

  return selections as WeaponSelections;
};

export const ammoColors: Record<AmmoType, string> = {
  heavy: "#6BCFA9",
  light: "orange",
  shotgun: "red",
  energy: "lime",
};

const variantColors = {
  base: "darkgrey",
  white: "grey",
  blue: "blue",
  purple: "purple",
  turbo: "gold", //"#cead21",
};

export const getWeaponCurveName = (weaponKey: WeaponKey, curveKey: string): string => {
  const weapon = weapons[weaponKey];

  return weapon.curveName?.(curveKey) || curveKey;
}

export const getChartDataset = (
  weaponKey: WeaponKey,
  curveKey: string = "base",
  limitToKilled: boolean = false,
  fortified: boolean = false
): ChartDataset | null => {
  const weapon = weapons[weaponKey];
  let curve = weapon.curves[curveKey];
  if (!curve) {
    return null;
  }

  if (fortified) {
    // Damage reduced by 15%, rounded down
    curve = curve.map(([x, y]) => [x, Math.floor(y * 0.85)]);
  }

  if (limitToKilled) {
    // Limit to red shields max
    curve = curve.filter((_, i) => !curve[i - 1] || curve[i - 1][1] < 225);
  }

  const dotColor = ammoColors[weapon.ammo];
  const lineColor = variantColors[curveKey] || "black";

  let label = weapon.name;
  if (Object.keys(weapon.curves).length > 1) {
    label += ` (${getWeaponCurveName(weaponKey, curveKey)})`;
  }

  return {
    label,
    borderColor: lineColor,
    backgroundColor: lineColor,
    pointBackgroundColor: dotColor,
    pointBorderColor: dotColor,
    borderWidth: 1,
    data: curve.map(([x, y]) => ({ x, y })),
    stepped: true,
  };
};

export const selectionsToDatasets = (
  selections: WeaponSelections,
  { limitToKilled = false, fortified = false } = {}
): ChartDataset[] => {
  const datasets: ChartDataset[] = [];

  let wk: WeaponKey;
  for (wk in selections) {
    const selection = selections[wk];
    const options = selection.options;

    // Skip if disabled
    if (!selection.enabled) continue;

    const variants = Object.keys(options).filter((k) => options[k]);

    variants.forEach((k) => {
      const ds = getChartDataset(wk, k, limitToKilled, fortified);

      if (!ds) {
        console.error("Could not get dataset for", wk, k);
      } else {
        datasets.push(ds);
      }
    });
  }

  return datasets;
};

// const ww = [
//   {
//     name: "Flatline",
//     ammo: ammo.HEAVY,
//     magazineSizes: {
//       base: 20,
//       white: 25,
//       blue: 28,
//       purple: 30,
//     },
//     curves: [
//       {
//         name: "Base",
//         curve: simple(19, 600, 30),
//       },
//     ],
//   },
//   {
//     name: "EVA-8",
//     ammo: ammo.SHOTGUN,
//     curves: rpmVariants(
//       63,
//       8
//     )({
//       Base: 126,
//       "White bolt": 126 * 1.15,
//       "Blue bolt": 126 * 1.25,
//       "Purple bolt": 126 * 1.35,
//     }),
//   },
//   {
//     name: "Wingman",
//     ammo: ammo.HEAVY,
//     magazineSizes: {},
//     curves: [
//       {
//         name: "Base",
//         curve: simple(45, 156, 9),
//       },
//     ],
//   },
//   {
//     name: "HAVOC",
//     ammo: ammo.ENERGY,
//     magazineSizes: {},
//     curves: [
//       {
//         name: "Base",
//         curve: simple(18, 672, 24, 0.5),
//       },
//     ],
//   },
// ];
