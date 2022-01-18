import { buildSelectionData, WeaponSelections } from './data';

import type { WeaponKey } from './weapons';

// "Storage" is the URL basically

const marshal = (selections: Partial<WeaponSelections>): string => {
  return encodeURIComponent(JSON.stringify(selections));
};

const unmarshal = (string: string): Partial<WeaponSelections> => {
  return JSON.parse(decodeURIComponent(string));
};

const optionsToShort = {
  base: 'b',
  white: 'w',
  blue: 'bl',
  purple: 'p',
};

const shortToOptions = Object.keys(optionsToShort).reduce((acc, long) => {
  const short = optionsToShort[long];
  acc[short] = long;
  return acc;
}, {});

const shortenOption = (key: string): string => {
  return optionsToShort[key] || key;
};

const expandOption = (shortKey: string): string => {
  return shortToOptions[shortKey] || shortKey;
};

const marshalSelections = (selections: WeaponSelections): URLSearchParams => {
  const params = new URLSearchParams();

  const keys = Object.keys(selections).sort();
  for (let key of keys) {
    const selection = selections[key];

    if (!selection.enabled) continue;

    const enabledOptions = Object.keys(selection.options)
      .filter(option => selection.options[option])
      .map(option => shortenOption(option))
      .join('.');

    params.append(key, enabledOptions);
  }

  console.log(params.toString());

  return params;
};

const unmarshalSelections = (
  params: URLSearchParams
): Partial<WeaponSelections> => {
  const selections: Partial<WeaponSelections> = {};

  for (let [key, value] of params.entries()) {
    if (key.match(/^conf\./)) {
      console.warn('config storage not implemented');
      continue;
    }

    const selection = {
      enabled: true,
      options: {
        base: false,
      },
    };

    value
      .split('.')
      .map(o => expandOption(o))
      .forEach(o => (selection.options[o] = true));

    selections[key] = selection;
  }

  console.log(selections);

  return selections;
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

  const params = marshalSelections(selections);
  unmarshalSelections(params);

  const url = new URL(window.location.toString());
  url.hash = params.toString(); //marshal(toSave);
  history.replaceState(null, '', url.toString());
};

export const loadSelections = (): Partial<WeaponSelections> | null => {
  try {
    const raw = location.hash.replace(/^#/, '');

    if (!raw) return null;

    const decoded = new URLSearchParams(raw);
    const parsed = unmarshalSelections(decoded);
    // const decoded = decodeURIComponent(raw);
    // const parsed = JSON.parse(decoded);

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
