import { buildSelectionData, WeaponSelections } from "./data";

import type { WeaponKey } from "./weapons";

// "Storage" is the URL basically

const marshal = (selections: Partial<WeaponSelections>): string => {
  return encodeURIComponent(JSON.stringify(selections));
};

const unmarshal = (string: string): Partial<WeaponSelections> => {
  return JSON.parse(decodeURIComponent(string));
};

export const saveSelections = (selections: WeaponSelections) => {
  const toSave: Partial<WeaponSelections> = {};

  // Filter out disabled weapons, to make the URL prettier
  let key: WeaponKey;
  for (key in selections) {
    if (selections[key].enabled) {
      toSave[key] = selections[key];
    }
  }

  const url = new URL(window.location.toString());
  url.hash = marshal(toSave);
  history.replaceState(null, "", url.toString());
};

export const loadSelections = (): Partial<WeaponSelections> | null => {
  try {
    const raw = location.hash.replace(/^#/, "");
    const decoded = decodeURIComponent(raw);
    const parsed = JSON.parse(decoded);

    return parsed;
  } catch (e) {
    return null;
  }
};

export const mergeSelections = (): WeaponSelections => {
  const fresh = buildSelectionData();
  const old = loadSelections();

  if (!old) {
    // Set a default so something shows up
    fresh.flatline.enabled = true;
    return fresh;
  }

  let key: WeaponKey;
  for (key in fresh) {
    const oldWeapon = old[key];
    if (oldWeapon) {
      // Copy selection over
      fresh[key].enabled = oldWeapon.enabled;
  
      // Copy existing options over
      for (let ok in oldWeapon.options) {
        if (ok in fresh[key].options) {
          fresh[key].options[ok] = oldWeapon.options[ok];
        }
      }
    }
  }

  // Overwrite with fresh
  saveSelections(fresh);

  return fresh;
};
