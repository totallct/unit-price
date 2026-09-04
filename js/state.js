import { CONVERSIONS } from './units.js';

export const state = {
  items: [],
  editingIndex: -1, // -1 indicates "Add New Item" mode
  draftItem: { price: '', size: '', unit: '', qty: 1 }
};

export function parseHash() {
  const hash = decodeURIComponent(window.location.hash.substring(1));
  if (!hash) {
    state.items = [];
    return;
  }

  const validUnits = Object.keys(CONVERSIONS).join('|');
  const unitRegex = new RegExp(`^([\\d.]+)-([\\d.]+)(${validUnits})(\\d*)$`);

  const parsed = [];
  hash.split('/').forEach(row => {
    const match = row.match(unitRegex);
    if (match) {
      parsed.push({ price: match[1], size: match[2], unit: match[3], qty: parseInt(match[4], 10) || 1 });
    }
  });
  state.items = parsed;
}

export function syncUrl() {
  const validItems = state.items.filter(i => i.price !== '' && i.size !== '' && i.unit !== '');
  if (validItems.length === 0) {
    history.replaceState(null, null, ' ');
  } else {
    const hashStr = validItems.map(i => {
      const q = (i.qty && i.qty !== 1) ? i.qty : '';
      return `${i.price}-${i.size}${i.unit}${q}`;
    }).join('/');
    window.location.hash = hashStr;
  }
}