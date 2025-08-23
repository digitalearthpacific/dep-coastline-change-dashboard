import type { PacificCountry, RatesOfChangeYear } from '../types'

// Responsive constants
export const DEFAULT_MOBILE_WIDTH_THRESHOLD = 768

export const RATES_OF_CHANGE_YEARS: RatesOfChangeYear[] = [
  { id: '2023', value: '2023' },
  { id: '2022', value: '2022' },
  { id: '2021', value: '2021' },
  { id: '2020', value: '2020' },
  { id: '2019', value: '2019' },
  { id: '2018', value: '2018' },
  { id: '2017', value: '2017' },
  { id: '2016', value: '2016' },
  { id: '2015', value: '2015' },
  { id: '2014', value: '2014' },
  { id: '2013', value: '2013' },
  { id: '2012', value: '2012' },
  { id: '2011', value: '2011' },
  { id: '2010', value: '2010' },
  { id: '2009', value: '2009' },
  { id: '2008', value: '2008' },
  { id: '2007', value: '2007' },
  { id: '2006', value: '2006' },
  { id: '2005', value: '2005' },
  { id: '2004', value: '2004' },
  { id: '2003', value: '2003' },
  { id: '2002', value: '2002' },
  { id: '2001', value: '2001' },
  { id: '2000', value: '2000' },
  { id: '1999', value: '1999' },
] as const

export const NONE_VALUE = 'none'

export const SEARCHBAR_INITIAL_VALUE = 'Select location for coastline data'

export const PACIFIC_COUNTRIES_NAMES: PacificCountry[] = [
  { id: 'ASM', name: 'American Samoa' },
  { id: 'COK', name: 'Cook Islands' },
  { id: 'FJI', name: 'Fiji' },
  { id: 'FSM', name: 'Federated States of Micronesia' },
  { id: 'GUM', name: 'Guam' },
  { id: 'KIR', name: 'Kiribati' },
  { id: 'MHL', name: 'Marshall Islands' },
  { id: 'MNP', name: 'Northern Mariana Islands' },
  { id: 'NCL', name: 'New Caledonia' },
  { id: 'NIU', name: 'Niue' },
  { id: 'NRU', name: 'Nauru' },
  { id: 'PCN', name: 'Pitcairn' },
  { id: 'PLW', name: 'Palau' },
  { id: 'PNG', name: 'Papua New Guinea' },
  { id: 'PYF', name: 'French Polynesia' },
  { id: 'SLB', name: 'Solomon Islands' },
  { id: 'TKL', name: 'Tokelau' },
  { id: 'TON', name: 'Tonga' },
  { id: 'TUV', name: 'Tuvalu' },
  { id: 'VUT', name: 'Vanuatu' },
  { id: 'WSM', name: 'Wallis and Futuna' },
] as const
