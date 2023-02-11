import type { ChartDataset, ChartOptions, ScatterDataPoint } from 'chart.js';
import type { WeaponKey } from './weapons';
import type { AmmoType, DamageCurve, DamageCurveSet } from './types';

import weapons from './weapons';

export type WeaponSelections = {
  [key in WeaponKey]: {
    enabled: boolean;
    options: {
      base: boolean;
      [opt: string]: boolean;
    };
  };
};

let helmetTiersTemp = ['none', 'white', 'blue', 'purple'] as const;
export type HelmetTier = typeof helmetTiersTemp[number];
export const helmetTiers: HelmetTier[] = [...helmetTiersTemp];

const helmetDamageReduction: Record<HelmetTier, number> = {
  none: 0,
  white: 0.2,
  blue: 0.5,
  purple: 0.65,
};

export type DamageOptions = {
  limitToKilled: boolean;
  fortified: boolean;
  headshots: boolean;
  helmet: HelmetTier;
};

export const newDamageOptions = (): DamageOptions => {
  return {
    limitToKilled: true,
    fortified: false,
    headshots: false,
    helmet: 'white',
  };
};

export type Selections = {
  weapons: WeaponSelections;
  damage: DamageOptions;
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
  heavy: '#6BCFA9',
  light: 'orange',
  shotgun: 'red',
  energy: 'lime',
  sniper: 'purple',
  heirloom: '#ff4e1d',
};

const variantColors = {
  base: 'darkgrey',
  white: 'grey',
  blue: 'blue',
  purple: 'purple',
  turbo: 'gold', //"#cead21",
};

export const getWeaponCurveName = (
  weaponKey: WeaponKey,
  curveKey: string
): string => {
  const weapon = weapons[weaponKey];

  return weapon.curveName?.(curveKey) || curveKey;
};

const colors = [
  '#377eb8',
  '#4daf4a',
  '#984ea3',
  '#a65628',
  '#ffff33',
  '#e41a1c',
  '#f781bf',
  '#ff7f00',
  '#999999',
];

type DatasetConfig = {
  weaponKey: WeaponKey;
  curveKey: string;
  limitToKilled: boolean;
  fortified: boolean;
  headshot: boolean;
  index: number;
};

export const getChartDataset = (
  weaponKey: WeaponKey,
  curveKey: string = 'base',
  damageOpts: DamageOptions,
  index: number = 0
): ChartDataset | null => {
  const weapon = weapons[weaponKey];
  let curve = weapon.curves[curveKey];
  if (!curve) {
    return null;
  }

  if (damageOpts.headshots) {
    const helmetReduction = helmetDamageReduction[damageOpts.helmet];
    curve = curve.map(([x, y]) => [
      x,
      y * (helmetReduction + (1 - helmetReduction) * weapon.headshot),
    ]);
  }

  if (damageOpts.fortified && !damageOpts.headshots) {
    // Damage reduced by 15%, rounded down
    curve = curve.map(([x, y]) => [x, Math.floor(y * 0.85)]);
  }

  if (damageOpts.limitToKilled) {
    // Limit to red shields max
    curve = curve.filter((_, i) => !curve[i - 1] || curve[i - 1][1] < 225);
  }

  const dotColor = ammoColors[weapon.ammo];
  // const lineColor = variantColors[curveKey] || 'black';
  const lineColor = colors[index % colors.length];

  let label = weapon.name;
  if (Object.keys(weapon.curves).length > 1) {
    label += ` (${getWeaponCurveName(weaponKey, curveKey)})`;
  }

  return {
    label,
    borderWidth: 2,
    borderColor: lineColor,
    backgroundColor: lineColor,
    pointBorderWidth: 1,
    pointBackgroundColor: dotColor,
    pointBorderColor: lineColor,
    data: curve.map(([x, y]) => ({ x, y })),
    stepped: true,
  };
};

export const getTTK = (dataset: ChartDataset): number => {
  for (let point of dataset.data) {
    const p = point as ScatterDataPoint;
    if (p.y >= 225) {
      return p.x;
    }
  }

  return Number.POSITIVE_INFINITY;
};

export const selectionsToDatasets = (
  selections: WeaponSelections,
  damageOpts: DamageOptions
): ChartDataset[] => {
  // Tuples of TTK and dataset
  const sortableDatasets: [number, ChartDataset][] = [];
  let i = 0;

  let wk: WeaponKey;
  for (wk in selections) {
    const selection = selections[wk];
    const options = selection.options;

    // Skip if disabled
    if (!selection.enabled) continue;

    const variants = Object.keys(options).filter(k => options[k]);

    variants.forEach(k => {
      const ds = getChartDataset(wk, k, damageOpts, i);

      if (!ds) {
        console.error('Could not get dataset for', wk, k);
      } else {
        const ttk = getTTK(ds);
        console.log('TTK for', wk, ttk);

        sortableDatasets.push([ttk, ds]);
        i++;
      }
    });
  }

  // Sort by TTK
  return sortableDatasets
    .sort(([a], [b]) => a - b)
    .map(([_, dataset]) => dataset);
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
