import type {
  DateSelectOptions,
  TerminologyType,
  PacificCountry,
  RatesOfChangeYear,
} from '../types'

export const MOBILE_WIDTH_THRESHOLD = 768
export const SMALL_DESKTOP_WIDTH_THRESHOLD = 1230
export const SEARCHBAR_INITIAL_VALUE = 'Fiji'
export const COUNTRY_DATA_URL =
  'https://dep-public-staging.s3.us-west-2.amazonaws.com/dep_ls_coastlines/dashboard_stats/0-0-10/country_summaries.geojson'
export const EXPORT_CLASS_NAME = 'is-exporting'

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

export const PACIFIC_COUNTRIES_NAMES: PacificCountry[] = [
  { id: 'ASM', name: 'American Samoa' },
  { id: 'COK', name: 'Cook Islands' },
  { id: 'FJI', name: 'Fiji' },
  { id: 'FSM', name: 'Federated States of Micronesia' },
  { id: 'PYF', name: 'French Polynesia' },
  { id: 'GUM', name: 'Guam' },
  { id: 'KIR', name: 'Kiribati' },
  { id: 'MHL', name: 'Marshall Islands' },
  { id: 'NRU', name: 'Nauru' },
  { id: 'NCL', name: 'New Caledonia' },
  { id: 'NIU', name: 'Niue' },
  { id: 'MNP', name: 'Northern Mariana Islands' },
  { id: 'PLW', name: 'Palau' },
  { id: 'PNG', name: 'Papua New Guinea' },
  { id: 'PCN', name: 'Pitcairn' },
  { id: 'WSM', name: 'Samoa' },
  { id: 'SLB', name: 'Solomon Islands' },
  { id: 'TKL', name: 'Tokelau' },
  { id: 'TON', name: 'Tonga' },
  { id: 'TUV', name: 'Tuvalu' },
  { id: 'VUT', name: 'Vanuatu' },
  { id: 'WLF', name: 'Wallis and Futuna' },
] as const

export const DATE_SELECT_OPTIONS: DateSelectOptions[] = [
  { id: 'between', value: 'between', label: 'Between' },
  { id: 'custom', value: 'custom', label: 'Custom' },
  { id: 'before', value: 'before', label: 'Before' },
  { id: 'after', value: 'after', label: 'After' },
] as const

export const GLOSSARY_TERMS: TerminologyType[] = [
  {
    term: 'Annual coastline position',
    definition:
      'The estimated location of the coastline in a given year, derived from satellite imagery that has been filtered to near-mean sea level using  tidal modelling.',
  },
  {
    term: 'Beta product',
    definition: 'A dataset or tool still in the testing phase, with potential gaps or limitations.',
  },
  {
    term: 'Buffer',
    definition:
      'A shape drawn around a point or points, representing areas within a certain distance of them.',
  },
  {
    term: 'Coastline change',
    definition: 'The movement of the coastline over time, including areas of retreat or growth.',
  },
  {
    term: 'Constrained WorldPop HDX',
    definition:
      'A  population dataset used for mapping population distribution in specific countries.',
  },
  {
    term: 'Digital Earth Pacific mangroves dataset',
    definition:
      'A dataset defining mangrove areas across the Pacific, used to measure mangrove extent in hotspot areas.',
  },
  {
    term: 'Experimental GIS Fiji population grid',
    definition:
      'A Fiji-specific population dataset used for detailed population estimates within hotspot areas.',
  },
  {
    term: 'Growth',
    definition: 'Areas where land is expanding due to natural or artificial processes.',
  },
  {
    term: 'High certainty / significant change',
    definition:
      'Criteria used to identify hotspot points with reliable and meaningful change rates.',
  },
  {
    term: 'Hotspot',
    definition: 'Coastal areas experiencing high levels of change, either retreat or growth.',
  },
  {
    term: 'Landsat surface reflectance data',
    definition: 'The satellite imagery data used to map annual coastline locations.',
  },
  {
    term: 'Linear regression',
    definition:
      'The statistical method used to calculate rates of coastline change by comparing coastline positions over time at the same locations.',
  },
  {
    term: 'Mean sea level',
    definition:
      'The average level of the ocean’s surface, used as a reference for measuring coastline position from year to year.',
  },
  {
    term: 'Metres per year',
    definition:
      'The unit that describes the rate of coastline change, showing how much the coastline shifts each year.',
  },
  {
    term: 'OpenStreetMap (OSM)',
    definition:
      'A collaborative mapping project providing building and infrastructure data. OpenStreetMap buildings data are used in this dashboard.',
  },
  {
    term: 'Point dataset',
    definition: 'A dataset where information is represented as individual points on a map.',
  },
  {
    term: 'Raster dataset',
    definition:
      'Data represented as a continuous grid of cells (pixels), with values for each cell.',
  },
  {
    term: 'Retreat',
    definition: 'Areas where the coastline is moving inland.',
  },
  {
    term: 'Tidal modelling',
    definition:
      'Models used to estimate tidal height at a specific point in time, which helps estimate the position of the coastline relative to mean sea level.',
  },
]

export const USER_GUIDE_TERMINOLOGY: TerminologyType[] = [
  {
    term: 'Annual coastline position',
    definition:
      'The estimated location of the coastline in a given year, derived from satellite imagery that has been filtered to near-mean sea level using  tidal modelling.',
  },
  {
    term: 'Buffer',
    definition:
      'A shape drawn around a point or points, representing areas within a certain distance of them.',
  },
  {
    term: 'Coastline change',
    definition: 'The movement of the coastline over time, including areas of retreat or growth.',
  },
  {
    term: 'Growth',
    definition: 'Areas where land is expanding due to natural or artificial processes.',
  },
  {
    term: 'Hotspot',
    definition: 'Coastal areas experiencing high levels of change, either retreat or growth.',
  },
  {
    term: 'Metres per year',
    definition:
      'The unit that describes the rate of coastline change, showing how much the coastline shifts each year.',
  },
  {
    term: 'Retreat',
    definition: 'Areas where the coastline is moving inland.',
  },
]
