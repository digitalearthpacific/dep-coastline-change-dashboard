import type { PacificCountry } from '../types'

// Pacific Island Countries with coordinates (sorted alphabetically by name) constants
export const PACIFIC_COUNTRIES: readonly PacificCountry[] = [
  {
    id: 'american-samoa',
    name: 'American Samoa',
    coordinates: [-170.7036, -14.271] as [number, number],
  },
  {
    id: 'cook-islands',
    name: 'Cook Islands',
    coordinates: [-159.7777, -21.2367] as [number, number],
  },
  {
    id: 'federated-states-micronesia',
    name: 'Federated States of Micronesia',
    coordinates: [158.215, 6.9248] as [number, number],
  },
  {
    id: 'fiji',
    name: 'Fiji',
    coordinates: [179.4144, -16.5781] as [number, number],
  },
  {
    id: 'french-polynesia',
    name: 'French Polynesia',
    coordinates: [-149.4068, -17.6797] as [number, number],
  },
  {
    id: 'guam',
    name: 'Guam',
    coordinates: [144.7937, 13.4443] as [number, number],
  },
  {
    id: 'kiribati',
    name: 'Kiribati',
    coordinates: [-157.363, 1.8709] as [number, number],
  },
  {
    id: 'marshall-islands',
    name: 'Marshall Islands',
    coordinates: [171.1845, 7.1315] as [number, number],
  },
  {
    id: 'nauru',
    name: 'Nauru',
    coordinates: [166.9315, -0.5228] as [number, number],
  },
  {
    id: 'new-caledonia',
    name: 'New Caledonia',
    coordinates: [165.618, -20.9043] as [number, number],
  },
  {
    id: 'niue',
    name: 'Niue',
    coordinates: [-169.8672, -19.0544] as [number, number],
  },
  {
    id: 'northern-mariana-islands',
    name: 'Northern Mariana Islands',
    coordinates: [145.6739, 17.3308] as [number, number],
  },
  {
    id: 'palau',
    name: 'Palau',
    coordinates: [134.5825, 7.515] as [number, number],
  },
  {
    id: 'papua-new-guinea',
    name: 'Papua New Guinea',
    coordinates: [143.9555, -6.314] as [number, number],
  },
  {
    id: 'pitcairn',
    name: 'Pitcairn',
    coordinates: [-127.9216, -25.0662] as [number, number],
  },
  {
    id: 'samoa',
    name: 'Samoa',
    coordinates: [-172.1046, -13.759] as [number, number],
  },
  {
    id: 'solomon-islands',
    name: 'Solomon Islands',
    coordinates: [160.1562, -9.6457] as [number, number],
  },
  {
    id: 'tokelau',
    name: 'Tokelau',
    coordinates: [-171.8484, -8.9673] as [number, number],
  },
  {
    id: 'tonga',
    name: 'Tonga',
    coordinates: [-175.1982, -21.1789] as [number, number],
  },
  {
    id: 'tuvalu',
    name: 'Tuvalu',
    coordinates: [179.1942, -7.1095] as [number, number],
  },
  {
    id: 'vanuatu',
    name: 'Vanuatu',
    coordinates: [166.9592, -15.3767] as [number, number],
  },
  {
    id: 'wallis-and-futuna',
    name: 'Wallis and Futuna',
    coordinates: [-177.1562, -13.7687] as [number, number],
  },
  // Error country for testing purposes, remove in production
  {
    id: 'error-country',
    name: 'Error Country',
    coordinates: [0, 0] as [number, number],
  },
] as const

// Responsive constants
export const DEFAULT_MOBILE_WIDTH_THRESHOLD = 768
