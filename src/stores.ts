import { writable } from 'svelte/store';

import * as storage from './storage';

export const selections = writable(storage.mergeSelections());
