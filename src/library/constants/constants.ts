import type {
  CustomCountryBboxType,
  DateSelectOptions,
  GlossaryTerms,
  PacificCountry,
  RatesOfChangeYear,
} from '../types'

export const DEFAULT_MOBILE_WIDTH_THRESHOLD = 768
export const SEARCHBAR_INITIAL_VALUE = 'Fiji'
export const COUNTRY_DATA_URL =
  'https://dep-public-staging.s3.us-west-2.amazonaws.com/dep_ls_coastlines/dashboard_stats/0-0-8/country_summaries.geojson'

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

export const CUSTOM_COUNTRY_BBOXES: CustomCountryBboxType = {
  ASM: [-171.1181647026751, -15.28997067989522, -169.10487554405287, -13.30481154763909],
  COK: [-166.8726088129923, -21.434293579403445, -154.01621577662743, -7.4464590649193525],
  FJI: [175.3474086202002, -21.40898934069834, 182.77349909833663, -13.433713722394529],
  FSM: null,
  PYF: null,
  GUM: [144.43493831635283, 13.160912074783127, 144.99280741485114, 13.772164950046843],
  KIR: null,
  MHL: [160.13650281052145, 3.010627979348655, 173.0912787464503, 17.33704910913619],
  NRU: [166.87270143524984, -0.5884204710010721, 166.98605144949732, -0.4655080342551372],
  NCL: [162.61034117035973, -23.255142860549967, 168.7450171920197, -17.01311000794057],
  NIU: [-170.0180911239551, -19.184364991506413, -169.72181448125542, -18.880644119232244],
  MNP: [142.46361609688313, 14.563476629272415, 148.67381107988888, 20.97259792550858],
  PLW: [129.6903128147394, 2.1223227000513845, 136.33349564758703, 9.28580942725499],
  PNG: [141.18750577618215, -16.770182526343703, 160.44994682512845, 2.958855693467811],
  PCN: [-131.12892879786176, -25.88140185702541, -127.97441409622282, -22.902642866538827],
  WSM: [-172.85353470235555, -14.460249867825397, -171.3156802819577, -12.910831263367285],
  SLB: [155.08489203671314, -17.509103183026156, 170.7847827827079, -1.507271185908607],
  TKL: [-172.62878078312465, -9.838709047518137, -171.05471528610235, -8.226708384477703],
  TON: [-179.37389195030084, -22.943610842605736, -170.81371264915475, -14.546862428973569],
  TUV: [174.4358041618906, -11.426892826914582, 181.57098968371986, -4.1007449392397035],
  VUT: [163.27406991262757, -21.482912638414476, 173.62590719274743, -11.197939655121047],
  WLF: [-178.57947025325987, -15.462207175271132, -175.78990484412154, -12.656409381163911],
} as const

export const DATE_SELECT_OPTIONS: DateSelectOptions[] = [
  { id: 'between', value: 'between', label: 'Between' },
  { id: 'custom', value: 'custom', label: 'Custom' },
  { id: 'before', value: 'before', label: 'Before' },
  { id: 'after', value: 'after', label: 'After' },
] as const

export const GLOSSARY_TERMS: GlossaryTerms[] = [
  {
    term: 'Coastline Change',
    definition: 'The movement of the coastline over time, including areas of retreat and growth',
  },
  {
    term: 'Term 2',
    definition: 'description',
  },
  {
    term: 'Term 3',
    definition: 'description',
  },
  {
    term: 'Term 4',
    definition: 'description',
  },
  {
    term: 'Term 5',
    definition: 'description',
  },
  {
    term: 'Term 6',
    definition: 'description',
  },
  {
    term: 'Term 7',
    definition: 'description',
  },
  {
    term: 'Term 8',
    definition: 'description',
  },
  {
    term: 'Term 9',
    definition: 'description',
  },
  {
    term: 'Term 10',
    definition: 'description',
  },
]
