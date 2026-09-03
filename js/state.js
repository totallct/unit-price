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
  
  const parsed = [];
  const validUnits = Object.keys(CONVERSIONS).join('|');
  const unitRegex = new RegExp(`^([\\d\\.]+)(` + validUnits + `)$`);

  hash.split('/').forEach(row => {
    const parts = row.split('-');
    if (parts.length === 2) {
      const match = parts[1].match(unitRegex);
      if (match) {
        parsed.push({ price: parseFloat(parts[0]) || '', qty: 1, size: parseFloat(match[1]) || '', unit: match[2] });
      }
    } else if (parts.length === 3) {
      const match = parts[2].match(unitRegex);
      if (match) {
        parsed.push({ price: parseFloat(parts[0]) || '', qty: parseInt(parts[1], 10) || 1, size: parseFloat(match[1]) || '', unit: match[2] });
      }
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
      const q = (i.qty && i.qty !== 1) ? `${i.qty}-` : '';
      return `${i.price}-${q}${i.size}${i.unit}`;
    }).join('/');
    window.location.hash = hashStr;
  }
}