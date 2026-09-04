import { CONVERSIONS } from './units.js';
import { state } from './state.js';
import { computeCalculateds } from './calc.js';
import { validateField } from './validation.js';

export function updateCalculatedDisplays() {
  const summaryRow = document.getElementById('summaryRow');
  const calculateds = computeCalculateds(state.items);

  const validVals = calculateds.map(c => c ? c.baseVal : null).filter(v => v !== null);
  const minBaseVal = validVals.length > 1 ? Math.min(...validVals) : null;

  let htmlCards = state.items.map((item, index) => {
    const calc = calculateds[index];
    const isCheapest = calc && minBaseVal !== null && calc.baseVal === minBaseVal;
    const isEditing = index === state.editingIndex;

    const packCount = item.qty || 1;
    const packStr = `${packCount} ${packCount === 1 ? 'pack' : 'packs'}`;
    
    const cardTitle = (item.price !== '' && item.size !== '' && item.unit !== '')
      ? `$${item.price} @ ${item.size}${item.unit}`
      : `Item ${index + 1}`;
      
    const priceText = calc ? `$${calc.unitPrice.toFixed(2)} / ${calc.displayUnit}` : '—';

    return `
      <div class="item-card ${isEditing ? 'active' : ''} ${isCheapest ? 'cheapest' : ''}" data-action="edit" data-index="${index}">
        <div class="badge-container">
          ${isEditing ? '<div class="badge-editing">⚙ Editing</div>' : ''}
          ${isCheapest ? '<div class="badge-cheapest">🏆 Best</div>' : ''}
        </div>
        <div class="card-name">${cardTitle}</div>
        <div class="card-details">${packStr}</div>
        <div class="card-price">${priceText}</div>
      </div>`;
  }).join('');

  const isAddingNew = state.editingIndex === -1;
  htmlCards += `
    <div class="item-card card-add ${isAddingNew ? 'active' : ''}" data-action="add-mode">
      Add Item
    </div>
  `;

  summaryRow.innerHTML = htmlCards;
}

export function renderForm() {
  const isEditing = state.editingIndex >= 0;
  const hasItems = state.items.length > 0;
  const activeItem = isEditing ? state.items[state.editingIndex] : state.draftItem;

  // 1. Button States
  const btnSave = document.getElementById('btnSave');
  const btnDelete = document.getElementById('btnDelete');
  const btnClearAll = document.getElementById('btnClearAll');

  if (btnSave) {
    btnSave.innerText = isEditing ? 'Update' : 'Add to List';
  }

  if (btnDelete) {
    // Show single item delete ONLY when editing
    btnDelete.style.display = isEditing ? 'inline-flex' : 'none';
    btnDelete.innerText = 'Delete';
  }

  if (btnClearAll) {
    // Show Clear All ONLY when NOT editing and items exist
    btnClearAll.style.display = (!isEditing && hasItems) ? 'inline-flex' : 'none';
  }

  // 2. Populate Field Values
  document.getElementById('inputPrice').value = activeItem.price ?? '';
  document.getElementById('inputSize').value = activeItem.size ?? '';
  document.getElementById('inputQty').value = activeItem.qty ?? 1;

  // 3. Trigger Validation
  ['price', 'size', 'unit', 'qty'].forEach(f => validateField(f, activeItem[f]));

  // 4. Category Locking & Unit Selector Rendering
  const activeUnitItem = state.items.find(i => i.unit !== '');
  const lockedCat = activeUnitItem ? CONVERSIONS[activeUnitItem.unit]?.category : null;

  const unitSelector = document.getElementById('unitSelector');
  if (unitSelector) {
    unitSelector.innerHTML = Object.keys(CONVERSIONS).filter(u => {
      if (!lockedCat) return true;
      return CONVERSIONS[u].category === lockedCat;
    }).map(u => `
      <button type="button" class="unit-btn ${activeItem.unit === u ? 'selected' : ''}" data-action="select-unit" data-unit="${u}">
        ${CONVERSIONS[u].label}
      </button>
    `).join('');
  }

  // 5. Refresh Calculated Cards & Highlights
  updateCalculatedDisplays();
}