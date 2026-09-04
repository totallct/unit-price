# Unit Price

A lightweight, mobile-responsive web application designed to help users quickly compare unit costs across different products, package sizes, quantities, and units of measurement.


## Features

- **Unit Conversions**: Supports standard unit conversions across Mass (`g`, `oz`, `lbs`, `catty`, `tael`), Volume (`ml`, `fl oz`, `gal`), Length (`mm`, `in`, `ft`), and Count (`pcs`).
- **Dynamic Calculation**: Instantly updates calculated unit prices and identifies the best value item.
- **Smart Validation**: Validates user inputs on blur to keep feedback clear without interrupting input entry. Auto-defaults missing package counts to `1`.
- **URL Hash Synchronization**: Saves application state directly into the URL hash, making comparisons shareable and easy to bookmark or refresh.
- **Responsive UI**: Optimized for mobile and desktop screens using scalable `rem` and `em` units.


## Project Structure

```text
├── index.html         # Main entry page
├── style.css          # App styles using CSS custom properties & relative units
└── js/
    ├── main.js        # Event listeners & core application workflow
    ├── state.js       # App state management & URL path sync
    ├── ui.js          # DOM rendering for forms & item cards
    ├── units.js       # Conversion rates & category mappings
    └── validation.js  # Field validation logic