import { CONVERSIONS } from './units.js';
import { state, parseHash, syncUrl } from './state.js';
import { validateField, validateAll } from './validation.js';
import { renderForm, updateCalculatedDisplays } from './ui.js';

function bindEvents() {
  ['Price', 'Size', 'Qty'].forEach(field => {
    const input = document.getElementById(`input${field}`);
    if (!input) return;

    // As user types: update state and clear error if it becomes valid
    input.addEventListener('input', (e) => {
      const fieldName = field.toLowerCase();
      let val = e.target.value.replace(/,/g, '');

      if (fieldName === 'qty') {
        val = val === '' ? '' : parseInt(val, 10);
      } else {
        val = val === '' ? '' : (parseFloat(val) || 0);
      }

      if (state.editingIndex >= 0) {
        state.items[state.editingIndex][fieldName] = val;
      } else {
        state.draftItem[fieldName] = val;
      }

      // Hide warning live while typing as long as input is valid
      if (val !== '' && val > 0) {
        validateField(fieldName, val, false);
      }
    });

    // On input completion (blur / leaving the field): validate immediately
    input.addEventListener('blur', (e) => {
      const fieldName = field.toLowerCase();
      const activeItem = state.editingIndex >= 0 ? state.items[state.editingIndex] : state.draftItem;
      validateField(fieldName, activeItem[fieldName], true);
    });
  });

  // Delegated Click Listener for Top Row Cards
  document.getElementById('summaryRow').addEventListener('click', (e) => {
    const card = e.target.closest('.item-card');
    if (!card) return;

    const action = card.dataset.action;
    if (action === 'edit') {
      state.editingIndex = parseInt(card.dataset.index, 10);
      renderForm();
    } else if (action === 'add-mode') {
      state.editingIndex = -1;
      renderForm();
    }
  });

  // Delegated Click Listener for Unit Selector
  document.getElementById('unitSelector').addEventListener('click', (e) => {
    const btn = e.target.closest('.unit-btn');
    if (!btn) return;

    const unit = btn.dataset.unit;
    if (state.editingIndex >= 0) {
      state.items[state.editingIndex].unit = unit;
      const cat = CONVERSIONS[unit].category;
      state.items.forEach(i => { if (i.unit && CONVERSIONS[i.unit].category !== cat) i.unit = unit; });
    } else {
      state.draftItem.unit = unit;
    }

    // Immediately show/clear validation when a unit is selected
    validateField('unit', unit, true);
    renderForm();
  });

  // Save / Update Button
  document.getElementById('btnSave').addEventListener('click', () => {
    const activeItem = state.editingIndex >= 0 ? state.items[state.editingIndex] : state.draftItem;

    // Auto-fix missing or incorrect pack count to 1
    if (!activeItem.qty || isNaN(activeItem.qty) || activeItem.qty < 1) {
      activeItem.qty = 1;
    }

    if (!validateAll(activeItem)) return;

    if (state.editingIndex === -1) {
      state.items.push({ ...state.draftItem });
      state.draftItem = { price: '', size: '', unit: state.draftItem.unit, qty: 1 };
    }
    state.editingIndex = -1;
    syncUrl();
    renderForm();
    updateCalculatedDisplays();
  });

  // Delete Button
  document.getElementById('btnDelete').addEventListener('click', () => {
    if (state.editingIndex >= 0) {
      state.items.splice(state.editingIndex, 1);
      state.editingIndex = -1;
      syncUrl();
      renderForm();
      updateCalculatedDisplays();
    }
  });

  // Hash change / Refresh Sync
  window.addEventListener('hashchange', () => {
    parseHash();
    updateCalculatedDisplays();
    renderForm();
  });
}

// Initial Run
parseHash();
bindEvents();
renderForm();
updateCalculatedDisplays();