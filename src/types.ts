export enum AmmoType {
  Heavy = 'heavy',
  Light = 'light',
  Shotgun = 'shotgun',
  Energy = 'energy',
  Sniper = 'sniper',
  Heirloom = 'heirloom'
}

export type DamagePoint = [number, number];
export type DamageCurve = DamagePoint[];
export type DamageCurveSet = {
  [optional: string]: DamageCurve;
};

export type Weapon = {
  name: string;
  ammo: AmmoType;
  magazineSizes?: {
    base?: number;
    white?: number;
    blue?: number;
    purple?: number;
  };
  curves: DamageCurveSet;
  curveName?: (key: string) => string;
};
