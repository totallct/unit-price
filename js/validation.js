import { CONVERSIONS } from './units.js';

export function validateField(fieldName, val, showError = false) {
  const warningEl = document.getElementById(`warning${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
  const inputEl = document.getElementById(`input${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);

  let warningText = '';

  if (fieldName === 'price') {
    if (val === '') warningText = 'Price is required.';
    else if (val <= 0) warningText = 'Price must be greater than 0.';
  } else if (fieldName === 'size') {
    if (val === '') warningText = 'Size is required.';
    else if (val <= 0) warningText = 'Size must be greater than 0.';
  } else if (fieldName === 'unit') {
    if (!val || !CONVERSIONS[val]) warningText = 'Please select a unit.';
  }
  // Qty validation warning is omitted - auto-defaulted to 1

  if (warningEl) {
    warningEl.innerText = warningText;
    if (warningText && showError) {
      warningEl.classList.add('visible');
      if (inputEl) inputEl.classList.add('has-error');
    } else {
      warningEl.classList.remove('visible');
      if (inputEl) inputEl.classList.remove('has-error');
    }
  }

  return warningText === '';
}

export function validateAll(activeItem) {
  const isPriceValid = validateField('price', activeItem.price, true);
  const isSizeValid = validateField('size', activeItem.size, true);
  const isUnitValid = validateField('unit', activeItem.unit, true);

  return isPriceValid && isSizeValid && isUnitValid;
}