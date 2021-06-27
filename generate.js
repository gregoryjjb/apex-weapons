
const util = require('util');

const round = n => Math.round(n * 10000) / 10000;

const simple = (damage, rpm, magazineSize, delay = 0) => {

  const deltaSeconds = (1 / rpm) * 60;

  const damageOverTime = [];

  for (let i = 0; i < magazineSize; i++) {
    const time = round(deltaSeconds * i) + delay;
    const cumDamage = round(damage * (i + 1));

    damageOverTime.push([time, cumDamage]);
  }

  return damageOverTime;
}

const magazineVariants = (damage, rpm) => magMap => {
  return Object.keys(magMap).map(name => {
    return {
      name,
      curve: simple(damage, rpm, magMap[name])
    }
  })
}

const rpmVariants = (damage, magazineSize) => rpmMap => {
  return Object.keys(rpmMap).map(name => {
    return {
      name,
      curve: simple(damage, rpmMap[name], magazineSize)
    }
  })
}

const ammo = {
  HEAVY: 'heavy',
  LIGHT: 'light',
  SHOTGUN: 'shotgun',
  ENERGY: 'energy',
}

const weapons = [
  {
    name: 'Flatline',
    ammo: ammo.HEAVY,
    magazineSizes: {
      base: 20,
      white: 25,
      blue: 28,
      purple: 30
    },
    curves: [
      {
        name: 'Base',
        curve: simple(19, 600, 30)
      }
    ]
  },
  {
    name: 'EVA-8',
    ammo: ammo.SHOTGUN,
    curves: rpmVariants(63, 8)({
      Base: 126,
      'White bolt': 126 * 1.15,
      'Blue bolt': 126 * 1.25,
      'Purple bolt': 126 * 1.35,
    })
  },
  {
    name: 'Wingman',
    ammo: ammo.HEAVY,
    magazineSizes: {
      
    },
    curves: [
      {
        name: 'Base',
        curve: simple(45, 156, 9)
      }
    ]
  },
  {
    name: 'HAVOC',
    ammo: ammo.ENERGY,
    magazineSizes: {},
    curves: [
      {
        name: 'Base',
        curve: simple(18, 672, 24, 0.5)
      }
    ]
  }
]

// console.log(JSON.stringify(weapons, null, 2));
// console.log(weapons[1])
console.log(util.inspect(weapons, { showHidden: false, depth: null }))
