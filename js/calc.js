import { CONVERSIONS } from './units.js';

export function getGlobalUnitScale(validItems) {
  if (validItems.length === 0) return { displayUnit: '', scaleFactor: 1 };

  const firstUnit = validItems[0].unit;
  const category = CONVERSIONS[firstUnit].category;

  let totalBaseSum = 0;
  validItems.forEach(item => {
    const config = CONVERSIONS[item.unit];
    totalBaseSum += item.qty * item.size * config.toBase;
  });
  const avgBaseQty = totalBaseSum / validItems.length;

  let displayUnit = firstUnit;
  let scaleFactor = 1;

  if (category === 'mass') {
    if (avgBaseQty >= 1000) { displayUnit = 'kg'; scaleFactor = 1000; }
    else if (avgBaseQty >= 100) { displayUnit = '100g'; scaleFactor = 100; }
    else { displayUnit = 'g'; scaleFactor = 1; }
  } else if (category === 'vol') {
    if (avgBaseQty >= 1000) { displayUnit = 'L'; scaleFactor = 1000; }
    else if (avgBaseQty >= 100) { displayUnit = '100ml'; scaleFactor = 100; }
    else { displayUnit = 'ml'; scaleFactor = 1; }
  } else if (category === 'len') {
    if (avgBaseQty >= 1000) { displayUnit = 'm'; scaleFactor = 1000; }
    else { displayUnit = '100mm'; scaleFactor = 100; }
  } else if (category === 'count') {
    displayUnit = 'pc';
    scaleFactor = 1;
  }

  return { displayUnit, scaleFactor };
}

export function computeCalculateds(items) {
  const validItems = items.filter(i => i.price !== '' && i.size !== '' && i.unit && CONVERSIONS[i.unit] && i.price > 0 && i.size > 0 && i.qty > 0);
  const globalScale = getGlobalUnitScale(validItems);

  return items.map(item => {
    if (!item || !item.unit || !CONVERSIONS[item.unit] || item.price === '' || item.size === '' || !item.qty || item.price <= 0 || item.size <= 0 || item.qty <= 0) {
      return null;
    }
    // Total weight = packs * size per pack * conversion factor to grams
    const totalBaseQty = item.qty * item.size * CONVERSIONS[item.unit].toBase;
    const baseVal = item.price / totalBaseQty;
    const unitPrice = baseVal * globalScale.scaleFactor;
    return { unitPrice, displayUnit: globalScale.displayUnit, baseVal };
  });
}