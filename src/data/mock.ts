import { daysAgoIso, daysFromNowIso, minutesAgoIso, nowIso } from '../lib/dates';

export type TabId = 'home' | 'services' | 'documents' | 'requests' | 'more';
export type ScreenId =
  | TabId
  | 'issue-certificate'
  | 'profile'
  | 'notifications'
  | 'fleet'
  | 'reviews';

export interface CompanyInfo {
  name: string;
  status: 'Active';
  usdot: string;
  mc: string;
  powerUnits: number;
  driversCount: number;
  address: string;
  email: string;
  phone: string;
}

export interface InProgressFiling {
  title: string;
  stepText: string;
  percent: number;
}

export interface HomeImageAsset {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  width: number;
  height: number;
}

export const HOME_IMAGES: Record<
  'heroTruck' | 'fleet' | 'driver' | 'warehouse' | 'roadNight' | 'advisor',
  HomeImageAsset
> = {
  heroTruck: {
    src: '/images/hero-truck-2.webp',
    srcSet: '/images/hero-truck-2-800.webp 800w, /images/hero-truck-2.webp 1200w',
    sizes: '(max-width: 480px) 100vw, 480px',
    alt: 'Deep navy sleeper semi-truck pulling a white dry van trailer along an open interstate highway curve at golden sunrise',
    width: 1200,
    height: 800,
  },
  fleet: {
    src: '/images/fleet.webp',
    srcSet:
      '/images/fleet-400.webp 400w, /images/fleet-800.webp 800w, /images/fleet.webp 1200w',
    sizes: '(max-width: 480px) 90vw, 360px',
    alt: 'Row of commercial semi trucks parked cleanly at a fleet depot',
    width: 1200,
    height: 675,
  },
  driver: {
    src: '/images/driver.webp',
    srcSet: '/images/driver-400.webp 400w, /images/driver-800.webp 800w',
    sizes: '120px',
    alt: 'Smiling commercial truck driver standing beside a freight tractor cab',
    width: 800,
    height: 1000,
  },
  warehouse: {
    src: '/images/warehouse.webp',
    srcSet:
      '/images/warehouse-400.webp 400w, /images/warehouse-800.webp 800w, /images/warehouse.webp 1200w',
    sizes: '180px',
    alt: 'Logistics warehouse distribution yard with freight trailers at loading docks',
    width: 1200,
    height: 675,
  },
  roadNight: {
    src: '/images/road-night.webp',
    srcSet:
      '/images/road-night-400.webp 400w, /images/road-night-800.webp 800w, /images/road-night.webp 1200w',
    sizes: '(max-width: 480px) 100vw, 440px',
    alt: 'Semi truck driving on an interstate highway at dusk with warm light trails',
    width: 1200,
    height: 675,
  },
  advisor: {
    src: '/images/advisor.webp',
    srcSet: '/images/advisor-400.webp 400w, /images/advisor-800.webp 800w',
    sizes: '80px',
    alt: 'Portrait of Sarah Jenkins, dedicated compliance and insurance advisor',
    width: 800,
    height: 800,
  },
};

export interface PolicyItem {
  id: string;
  name: string;
  carrier: string;
  policyNumber: string;
  status: 'Active';
  coverageValue: string;
  validThruValue: string;
  deductible: string;
  effectiveDate: string;
  unitsCovered: string;
  image: HomeImageAsset;
}

export interface AdvisorInfo {
  name: string;
  role: string;
  phone: string;
}

export interface VehicleItem {
  id: string;
  name: string;
  vin: string;
  operationType: 'OTR' | 'Regional';
  cab: 'Sleeper' | 'Day Cab';
  statedValue: string;
  radius: string;
}

export interface FleetTruck extends VehicleItem {
  unitNumber: string;
  status: 'Insured' | 'Pending';
}

export interface FleetDriver {
  id: string;
  name: string;
  initials: string;
  cdlNumber: string;
  cdlState: string;
  medicalExpiryIso: string;
  statusTone: 'green' | 'red' | 'amber';
  assignedUnit: string;
  phone: string;
}

export interface CoverageOption {
  id: string;
  title: string;
  description: string;
  group: 'included' | 'addon';
  checked: boolean;
  locked: boolean;
}

export interface ServiceItem {
  id: string;
  section: 'Registrations & Authority' | 'Fuel Taxes & State Permits' | 'Safety & Driver Compliance';
  filterGroup: 'Filings' | 'Permits' | 'Safety';
  title: string;
  shortTitle?: string;
  description: string;
  tag: { label: string; tone: 'teal' | 'neutral' | 'red' };
  price: string;
  shortPrice?: string;
  ctaLabel: string;
}

export interface DocumentActivity {
  id: string;
  text: string;
  createdAt: string;
}

export interface VaultDocument {
  id: string;
  category: 'Insurance' | 'Vehicles' | 'Permits';
  metaLine: string;
  statusTone: 'teal' | 'red';
  title: string;
  previewSummary: string;
  createdAt: string;
  expiresAt?: string;
  fileTypeLabel?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  dataUrl?: string;
  previewOmitted?: boolean;
  activities?: DocumentActivity[];
}

export interface RequestTimelineEntry {
  id: string;
  label: string;
  at: string;
}

export interface RequestItem {
  id: string;
  ref: string;
  createdAt: string;
  statusLabel: string;
  statusTone: 'red' | 'teal' | 'neutral';
  filterTags: ('in_progress' | 'action_needed' | 'cleared')[];
  title: string;
  subtitle: string;
  actionNeeded?: boolean;
  stepProgress?: string;
  stepper?: {
    steps: { name: string; state: 'done' | 'active' | 'pending' }[];
  };
  advisorNote?: string;
  receiptAmount?: string;
  downloadNotice?: string;
  timeline?: RequestTimelineEntry[];
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  urgent?: boolean;
  targetScreen?: ScreenId;
}

export interface CarrierReview {
  id: string;
  initials: string;
  company: string;
  rating: number;
  createdAt: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  from: 'sarah' | 'user';
  text: string;
  createdAt: string;
}

export type QuoteStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface QuoteDraft {
  id: string;
  title: string;
  currentStep: QuoteStep;
  totalSteps: 6;
  updatedAt: string;
  effectiveDate: string;
  garagingState: string;
  liabilityLimit: '$750,000 CSL' | '$1,000,000 CSL' | '$2,000,000 CSL';
  authorityScope: 'Interstate (48 States)' | 'Regional Multi-State' | 'Intrastate Only';
  operatingRadius: '100 mi' | '300 mi' | '500+ mi';
  annualMiles: string;
  hazmat: boolean;
  vehicles: VehicleItem[];
  trailerType: string;
  cargoClass: string;
  maxCargoValue: string;
  coverages: CoverageOption[];
  selectedDriverIds: string[];
  priorCarrier: string;
  yearsInBusiness: string;
  lossHistory: '0 claims (Clean 3 yrs)' | '1 minor claim' | '2+ claims';
  filingsNeeded: string[];
  submissionNotes: string;
}

export interface AppSettings {
  reduceMotion: boolean;
  showTutorial: boolean;
  session: {
    signedIn: boolean;
    userEmail: string;
    lastSignedInAt: string;
  };
}

export interface UiState {
  activeTab: TabId;
  screen: ScreenId;
  alertResolved: boolean;
  servicesSearch: string;
  servicesFilter: 'All' | 'Filings' | 'Permits' | 'Safety';
  documentsFilter: 'All' | 'Insurance' | 'Vehicles' | 'Permits';
  requestsFilter: 'all' | 'in_progress' | 'action_needed' | 'cleared';
  requestsExpanded: Record<string, boolean>;
  notificationsFilter: 'all' | 'unread' | 'urgent';
  fleetSegment: 'trucks' | 'drivers';
  scrollPositions: Record<string, number>;
}

export interface RevasSeedBundle {
  company: CompanyInfo;
  trucks: FleetTruck[];
  drivers: FleetDriver[];
  policies: PolicyItem[];
  documents: VaultDocument[];
  requests: RequestItem[];
  notifications: NotificationItem[];
  quote: QuoteDraft | null;
  reviews: CarrierReview[];
  chatMessages: ChatMessage[];
  settings: AppSettings;
  ui: UiState;
}

export const COMPANY: CompanyInfo = {
  name: 'Apex Hauling LLC',
  status: 'Active',
  usdot: '3892011',
  mc: 'MC-145290',
  powerUnits: 6,
  driversCount: 5,
  address: '4820 Freight Corridor Pkwy, Suite 210, Dallas, TX 75247',
  email: 'dispatch@apexhauling.com',
  phone: '(214) 555-0194',
};

export const IN_PROGRESS_FILING: InProgressFiling = {
  title: 'Fleet Policy Quote',
  stepText: 'Step 3 of 6',
  percent: 50,
};

export const HOME_CONTENT = {
  greeting: 'Good morning',
  alertHeadline: 'Medical card expires in 9 days',
  alertSubline: 'Marcus Vance',
  alertUploadLabel: 'Upload',
  resolvedTitle: 'All items resolved',
  resolvedSubtitle: 'Marcus Vance’s medical card is uploaded for review.',
  quickActionsTitle: 'Quick actions',
  quickActions: [
    {
      id: 'quote' as const,
      label: 'Get Quote',
      image: HOME_IMAGES.fleet,
      objectPosition: 'center center',
    },
    {
      id: 'filing' as const,
      label: 'DOT Filing',
      image: HOME_IMAGES.warehouse,
      objectPosition: 'center center',
    },
    {
      id: 'document' as const,
      label: 'Add Document',
      image: HOME_IMAGES.roadNight,
      objectPosition: '75% center',
    },
  ],
  promoBanner: {
    badge: 'UCR 2025',
    title: 'Renew your UCR before the deadline',
    buttonLabel: 'File now',
    image: HOME_IMAGES.roadNight,
  },
  policiesTitle: 'Policies',
  policiesSubtitle: 'Active carrier coverage',
  advisorPrefix: 'Your advisor:',
};

export const POLICIES: PolicyItem[] = [
  {
    id: 'pol-1',
    name: 'Primary Auto Liability',
    carrier: 'Progressive Commercial',
    policyNumber: 'PRG-99042',
    status: 'Active',
    coverageValue: '$1,000,000 CSL',
    validThruValue: 'Nov 30, 2025',
    deductible: '$1,000 Deductible',
    effectiveDate: 'Nov 30, 2024',
    unitsCovered: '6 Trucks • 5 Drivers',
    image: HOME_IMAGES.heroTruck,
  },
  {
    id: 'pol-2',
    name: 'Motor Truck Cargo',
    carrier: "Lloyd's Syndicate",
    policyNumber: 'LLY-44021',
    status: 'Active',
    coverageValue: '$250,000 Limit',
    validThruValue: 'Nov 30, 2025',
    deductible: '$2,500 Deductible',
    effectiveDate: 'Nov 30, 2024',
    unitsCovered: 'Dry Van & Reefer Loads',
    image: HOME_IMAGES.fleet,
  },
];

export const ADVISOR: AdvisorInfo = {
  name: 'Sarah Jenkins',
  role: 'Compliance & Insurance Advisor',
  phone: '(800) 555-8782',
};

export const INITIAL_VEHICLES: VehicleItem[] = [
  {
    id: 'veh-1',
    name: '2022 Freightliner Cascadia',
    vin: '1FUJGLDR5NL4981',
    operationType: 'OTR',
    cab: 'Sleeper',
    statedValue: '$145,000',
    radius: '500+ mi',
  },
  {
    id: 'veh-2',
    name: '2021 Kenworth T680',
    vin: '1XKDDP9X8MR1120',
    operationType: 'Regional',
    cab: 'Day Cab',
    statedValue: '$118,000',
    radius: '300 mi',
  },
];

export const INITIAL_TRUCKS: FleetTruck[] = [
  {
    id: 'trk-1',
    unitNumber: 'Unit #101',
    name: '2022 Freightliner Cascadia',
    vin: '1FUJGLDR5NL4981',
    operationType: 'OTR',
    cab: 'Sleeper',
    statedValue: '$145,000',
    radius: '500+ mi',
    status: 'Insured',
  },
  {
    id: 'trk-2',
    unitNumber: 'Unit #102',
    name: '2021 Kenworth T680',
    vin: '1XKDDP9X8MR1120',
    operationType: 'Regional',
    cab: 'Day Cab',
    statedValue: '$118,000',
    radius: '300 mi',
    status: 'Insured',
  },
  {
    id: 'trk-3',
    unitNumber: 'Unit #103',
    name: '2023 Volvo VNL 860',
    vin: '4V4NC9EH7PN603412',
    operationType: 'OTR',
    cab: 'Sleeper',
    statedValue: '$158,000',
    radius: '500+ mi',
    status: 'Insured',
  },
  {
    id: 'trk-4',
    unitNumber: 'Unit #104',
    name: '2023 Kenworth T680',
    vin: '1XKDP9X9PR309941',
    operationType: 'OTR',
    cab: 'Sleeper',
    statedValue: '$152,000',
    radius: '500+ mi',
    status: 'Insured',
  },
  {
    id: 'trk-5',
    unitNumber: 'Unit #105',
    name: '2022 Peterbilt 579',
    vin: '1XPBD49X1ND781204',
    operationType: 'Regional',
    cab: 'Day Cab',
    statedValue: '$129,000',
    radius: '300 mi',
    status: 'Pending',
  },
  {
    id: 'trk-6',
    unitNumber: 'Unit #106',
    name: '2020 International LT',
    vin: '3HSDZAPR2LN442810',
    operationType: 'Regional',
    cab: 'Day Cab',
    statedValue: '$98,000',
    radius: '300 mi',
    status: 'Insured',
  },
];

export const INITIAL_DRIVERS: FleetDriver[] = [
  {
    id: 'drv-1',
    name: 'Marcus Vance',
    initials: 'MV',
    cdlNumber: 'CDL-A ••••8841',
    cdlState: 'TX',
    medicalExpiryIso: daysFromNowIso(9),
    statusTone: 'red',
    assignedUnit: 'Unit #101',
    phone: '(214) 555-0142',
  },
  {
    id: 'drv-2',
    name: 'Elena Rostova',
    initials: 'ER',
    cdlNumber: 'CDL-A ••••3190',
    cdlState: 'TX',
    medicalExpiryIso: daysFromNowIso(280),
    statusTone: 'green',
    assignedUnit: 'Unit #102',
    phone: '(214) 555-0168',
  },
  {
    id: 'drv-3',
    name: 'Derrick Holloway',
    initials: 'DH',
    cdlNumber: 'CDL-A ••••5502',
    cdlState: 'OK',
    medicalExpiryIso: daysFromNowIso(210),
    statusTone: 'green',
    assignedUnit: 'Unit #103',
    phone: '(405) 555-0119',
  },
  {
    id: 'drv-4',
    name: 'Carlos Mendez',
    initials: 'CM',
    cdlNumber: 'CDL-A ••••7429',
    cdlState: 'TX',
    medicalExpiryIso: daysFromNowIso(340),
    statusTone: 'green',
    assignedUnit: 'Unit #104',
    phone: '(214) 555-0183',
  },
  {
    id: 'drv-5',
    name: 'Trevor Brooks',
    initials: 'TB',
    cdlNumber: 'CDL-A ••••1904',
    cdlState: 'LA',
    medicalExpiryIso: daysFromNowIso(140),
    statusTone: 'green',
    assignedUnit: 'Unit #106',
    phone: '(318) 555-0177',
  },
];

export const TRAILER_TYPES = [
  'Dry Van 53ft (Standard)',
  'Reefer 53ft (Temp Controlled)',
  'Flatbed 48ft / Step Deck',
  'Box Truck 26ft (Liftgate)',
];

export const CARGO_CLASSIFICATIONS = [
  'General Freight (Non-Hazmat)',
  'Refrigerated Foods & Produce',
  'Building Materials & Steel',
  'Auto Parts & Machinery',
];

export const INITIAL_COVERAGE_OPTIONS: CoverageOption[] = [
  {
    id: 'cov-auto',
    title: 'Primary Auto Liability',
    description: '$1,000,000 required federal coverage',
    group: 'included',
    checked: true,
    locked: true,
  },
  {
    id: 'cov-cargo',
    title: 'Motor Truck Cargo',
    description: '$250,000 standard cargo protection',
    group: 'included',
    checked: true,
    locked: false,
  },
  {
    id: 'cov-phys',
    title: 'Physical Damage',
    description: 'Comprehensive & collision ($2,500 deductible)',
    group: 'included',
    checked: true,
    locked: false,
  },
  {
    id: 'cov-gl',
    title: 'General Liability',
    description: 'Premises & off-road terminal incidents',
    group: 'addon',
    checked: false,
    locked: false,
  },
  {
    id: 'cov-interchange',
    title: 'Trailer Interchange',
    description: '$50,000 for non-owned trailers',
    group: 'addon',
    checked: false,
    locked: false,
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'srv-boc3',
    section: 'Registrations & Authority',
    filterGroup: 'Filings',
    title: 'BOC-3 Process Agent Filing',
    shortTitle: 'BOC-3 Filing',
    description: 'Federal legal agent coverage in all 50 states for MC authority.',
    tag: { label: 'Same-day filing', tone: 'teal' },
    price: '$0 included',
    shortPrice: '$0 included',
    ctaLabel: 'Request',
  },
  {
    id: 'srv-mcs150',
    section: 'Registrations & Authority',
    filterGroup: 'Filings',
    title: 'MCS-150 Biennial Update',
    shortTitle: 'MCS-150 Update',
    description: 'Required 24-month USDOT update to keep your authority active.',
    tag: { label: '$1,000/day fine if expired', tone: 'red' },
    price: '$79 one-time',
    shortPrice: '$79 one-time',
    ctaLabel: 'Request',
  },
  {
    id: 'srv-ifta',
    section: 'Fuel Taxes & State Permits',
    filterGroup: 'Permits',
    title: 'IFTA License & Quarterly Filing',
    shortTitle: 'IFTA License',
    description: 'Fuel tax mileage prep, receipt reconciliation, and decals.',
    tag: { label: 'Quarterly filing', tone: 'teal' },
    price: '$125 / quarter',
    shortPrice: '$125 / quarter',
    ctaLabel: 'Request',
  },
  {
    id: 'srv-permits',
    section: 'Fuel Taxes & State Permits',
    filterGroup: 'Permits',
    title: 'KYU, NY HUT & NM Weight Permits',
    shortTitle: 'State Permits',
    description: 'State mileage tax permits and trip passes in 48 hours.',
    tag: { label: '48h approval', tone: 'neutral' },
    price: '$95 / state',
    shortPrice: 'From $95 / state',
    ctaLabel: 'Request',
  },
  {
    id: 'srv-clearinghouse',
    section: 'Safety & Driver Compliance',
    filterGroup: 'Safety',
    title: 'Drug & Alcohol Clearinghouse',
    shortTitle: 'Clearinghouse',
    description: 'Annual driver queries, pre-employment checks, and random pool.',
    tag: { label: 'Annual plan', tone: 'teal' },
    price: '$149 / year',
    shortPrice: '$149 / year',
    ctaLabel: 'Enroll',
  },
  {
    id: 'srv-audit',
    section: 'Safety & Driver Compliance',
    filterGroup: 'Safety',
    title: 'New Entrant Safety Audit Prep',
    shortTitle: 'Audit Prep',
    description: 'Mock inspection and compliance binder review before federal audit.',
    tag: { label: '1-on-1 specialist', tone: 'neutral' },
    price: '$349 complete',
    shortPrice: '$349 total',
    ctaLabel: 'Schedule',
  },
];

export const INITIAL_DOCUMENTS: VaultDocument[] = [
  {
    id: 'doc-coi',
    category: 'Insurance',
    metaLine: 'PDF • Valid until Oct 2025',
    statusTone: 'teal',
    title: 'Certificate of Insurance (COI) — Auto & Cargo',
    previewSummary:
      'ACORD 25 Certificate of Liability Insurance • Progressive Commercial (PRG-99042) & Lloyd’s (LLY-44021) • $1,000,000 Auto / $250,000 Cargo.',
    createdAt: daysAgoIso(45),
    fileTypeLabel: 'PDF',
    activities: [],
  },
  {
    id: 'doc-ifta',
    category: 'Permits',
    metaLine: 'PDF • Valid 2024–2025',
    statusTone: 'teal',
    title: '2024–2025 IFTA License & Cab Credentials',
    previewSummary:
      'Texas IFTA License #TX-3892011 • Decals verified for all 6 power units.',
    createdAt: daysAgoIso(32),
    fileTypeLabel: 'PDF',
    activities: [],
  },
  {
    id: 'doc-boc3',
    category: 'Permits',
    metaLine: 'PDF • Active on file',
    statusTone: 'teal',
    title: 'BOC-3 Process Agent Designation (50 States)',
    previewSummary:
      'Blanket Process Agent Designation recorded on SAFER for MC-145290.',
    createdAt: daysAgoIso(28),
    fileTypeLabel: 'PDF',
    activities: [],
  },
  {
    id: 'doc-med',
    category: 'Permits',
    metaLine: 'Card • Renewal due soon',
    statusTone: 'red',
    title: "Medical Examiner's Certificate — Marcus Vance",
    previewSummary:
      'Commercial Driver Medical Card • Driver: Marcus Vance • Renewal needed before expiration.',
    createdAt: daysAgoIso(12),
    expiresAt: daysFromNowIso(9),
    fileTypeLabel: 'Card',
    activities: [],
  },
  {
    id: 'doc-cab',
    category: 'Vehicles',
    metaLine: 'PDF • Registered 80,000 lbs',
    statusTone: 'teal',
    title: 'Apportioned Cab Card — 2023 Kenworth T680 (Unit #104)',
    previewSummary:
      'IRP Apportioned Registration Cab Card • All 48 states • GVW 80,000 lbs.',
    createdAt: daysAgoIso(19),
    fileTypeLabel: 'PDF',
    activities: [],
  },
];

export const INITIAL_REQUESTS: RequestItem[] = [
  {
    id: 'req-quote',
    ref: 'REV-Q-88219',
    createdAt: daysAgoIso(2),
    statusLabel: 'Action needed',
    statusTone: 'red',
    filterTags: ['in_progress', 'action_needed'],
    title: 'Fleet Policy Quote',
    subtitle: 'Step 3 of 6 • Truck & Cargo (5 Units)',
    actionNeeded: true,
    stepProgress: 'Step 3 of 6',
    stepper: {
      steps: [
        { name: 'Submitted', state: 'done' },
        { name: 'Review', state: 'active' },
        { name: 'Done', state: 'pending' },
      ],
    },
    advisorNote:
      'Comparing market quotes with Progressive & Northland. Please upload the updated driving record (MVR) for Marcus Vance.',
    timeline: [
      { id: 'tl-1', label: 'Quote intake opened', at: daysAgoIso(2) },
      { id: 'tl-2', label: 'Sarah Jenkins requested updated MVR', at: daysAgoIso(1) },
    ],
  },
  {
    id: 'req-ucr',
    ref: 'REV-DOT-44910',
    createdAt: daysAgoIso(1),
    statusLabel: 'In progress',
    statusTone: 'teal',
    filterTags: ['in_progress'],
    title: '2025 UCR Registration',
    subtitle: 'Annual multi-state authority renewal • Step 3 of 4',
    receiptAmount: '$176.00 Paid',
    timeline: [
      { id: 'tl-ucr-1', label: 'UCR filing payment received ($176.00)', at: daysAgoIso(1) },
    ],
  },
  {
    id: 'req-boc3',
    ref: 'REV-DOT-39102',
    createdAt: daysAgoIso(38),
    statusLabel: 'Active',
    statusTone: 'teal',
    filterTags: ['cleared'],
    title: 'BOC-3 Process Agent Filing',
    subtitle: 'Legal process agent active in 50 states',
    downloadNotice: 'Electronic BOC-3 Notice validated on SAFER.',
  },
  {
    id: 'req-ch',
    ref: 'REV-DRV-1029',
    createdAt: daysAgoIso(3),
    statusLabel: 'Cleared',
    statusTone: 'teal',
    filterTags: ['cleared'],
    title: 'Driver Drug & Alcohol Check',
    subtitle: 'Pre-employment roster query passed',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Medical card expires in 9 days',
    body: 'Marcus Vance needs an updated medical card before expiration.',
    createdAt: minutesAgoIso(18),
    read: false,
    urgent: true,
    targetScreen: 'documents',
  },
  {
    id: 'notif-2',
    title: 'MVR needed for Fleet Policy Quote',
    body: 'Sarah Jenkins requested an updated MVR for Marcus Vance.',
    createdAt: minutesAgoIso(120),
    read: false,
    urgent: true,
    targetScreen: 'requests',
  },
  {
    id: 'notif-3',
    title: '2025 UCR payment confirmed',
    body: 'Your $176.00 UCR filing fee was received and submitted.',
    createdAt: daysAgoIso(1),
    read: false,
    targetScreen: 'requests',
  },
  {
    id: 'notif-4',
    title: 'BOC-3 filing is active',
    body: 'Electronic blanket process agent designation verified in 50 states.',
    createdAt: daysAgoIso(3),
    read: true,
  },
];

export const REVIEWS_SUMMARY = {
  rating: '4.9',
  trustedText: 'Trusted by 2,400+ carriers',
  basedOnText: 'Based on verified reviews',
};

export const INITIAL_REVIEWS: CarrierReview[] = [
  {
    id: 'rev-1',
    initials: 'RT',
    company: "Ray's Transport",
    rating: 5,
    createdAt: daysAgoIso(14),
    text: 'Filed our UCR and BOC-3 in one day. Sarah answered every question.',
  },
  {
    id: 'rev-2',
    initials: 'NL',
    company: 'North Line Freight',
    rating: 5,
    createdAt: daysAgoIso(30),
    text: 'Quote was fast and the fleet coverage was clear. Easy to upload documents.',
  },
  {
    id: 'rev-3',
    initials: 'HV',
    company: 'Horizon Valley Hauling',
    rating: 5,
    createdAt: daysAgoIso(60),
    text: 'Having our COIs, permits, and driver medical cards in one place saves us hours every week.',
  },
];

export function createInitialChatMessages(baseNowMs = Date.now()): ChatMessage[] {
  return [
    {
      id: 'chat-1',
      from: 'sarah',
      text: "Hi! I'm reviewing your Progressive & Northland fleet quote. Once you upload Marcus Vance's updated MVR, we can lock in rates.",
      createdAt: minutesAgoIso(18, baseNowMs),
    },
    {
      id: 'chat-2',
      from: 'sarah',
      text: 'Also a reminder: UCR registration for 2025 can be filed right inside Services whenever you are ready.',
      createdAt: minutesAgoIso(17, baseNowMs),
    },
  ];
}

export function createDefaultQuoteDraft(
  baseNowMs = Date.now(),
  step: QuoteStep = 3,
): QuoteDraft {
  return {
    id: 'quote-fleet-2025',
    title: 'Fleet Policy Quote',
    currentStep: step,
    totalSteps: 6,
    updatedAt: nowIso(baseNowMs),
    effectiveDate: daysFromNowIso(15, baseNowMs).slice(0, 10),
    garagingState: 'TX',
    liabilityLimit: '$1,000,000 CSL',
    authorityScope: 'Interstate (48 States)',
    operatingRadius: '500+ mi',
    annualMiles: '120,000',
    hazmat: false,
    vehicles: INITIAL_VEHICLES.map((v) => ({ ...v })),
    trailerType: TRAILER_TYPES[0],
    cargoClass: CARGO_CLASSIFICATIONS[0],
    maxCargoValue: '150,000',
    coverages: INITIAL_COVERAGE_OPTIONS.map((c) => ({ ...c })),
    selectedDriverIds: INITIAL_DRIVERS.map((d) => d.id),
    priorCarrier: 'Progressive Commercial',
    yearsInBusiness: '6',
    lossHistory: '0 claims (Clean 3 yrs)',
    filingsNeeded: ['BMC-91X Federal Filing', 'MCS-90 Endorsement'],
    submissionNotes: '',
  };
}

export function createInitialSettings(baseNowMs = Date.now()): AppSettings {
  return {
    reduceMotion: false,
    showTutorial: false,
    session: {
      signedIn: true,
      userEmail: COMPANY.email,
      lastSignedInAt: nowIso(baseNowMs),
    },
  };
}

export function createInitialUiState(): UiState {
  return {
    activeTab: 'home',
    screen: 'home',
    alertResolved: false,
    servicesSearch: '',
    servicesFilter: 'All',
    documentsFilter: 'All',
    requestsFilter: 'all',
    requestsExpanded: {},
    notificationsFilter: 'all',
    fleetSegment: 'trucks',
    scrollPositions: {},
  };
}

export function createSeedBundle(baseNowMs = Date.now()): RevasSeedBundle {
  return {
    company: { ...COMPANY },
    trucks: INITIAL_TRUCKS.map((t) => ({ ...t })),
    drivers: INITIAL_DRIVERS.map((d, idx) => ({
      ...d,
      medicalExpiryIso:
        idx === 0
          ? daysFromNowIso(9, baseNowMs)
          : idx === 1
            ? daysFromNowIso(280, baseNowMs)
            : idx === 2
              ? daysFromNowIso(210, baseNowMs)
              : idx === 3
                ? daysFromNowIso(340, baseNowMs)
                : daysFromNowIso(140, baseNowMs),
    })),
    policies: POLICIES.map((p) => ({ ...p, image: { ...p.image } })),
    documents: INITIAL_DOCUMENTS.map((doc, idx) => ({
      ...doc,
      createdAt:
        idx === 0
          ? daysAgoIso(45, baseNowMs)
          : idx === 1
            ? daysAgoIso(32, baseNowMs)
            : idx === 2
              ? daysAgoIso(28, baseNowMs)
              : idx === 3
                ? daysAgoIso(12, baseNowMs)
                : daysAgoIso(19, baseNowMs),
      expiresAt: idx === 3 ? daysFromNowIso(9, baseNowMs) : undefined,
      activities: [],
    })),
    requests: INITIAL_REQUESTS.map((r, idx) => ({
      ...r,
      createdAt:
        idx === 0
          ? daysAgoIso(2, baseNowMs)
          : idx === 1
            ? daysAgoIso(1, baseNowMs)
            : idx === 2
              ? daysAgoIso(38, baseNowMs)
              : daysAgoIso(3, baseNowMs),
      stepper: r.stepper ? { steps: r.stepper.steps.map((s) => ({ ...s })) } : undefined,
      timeline: r.timeline ? r.timeline.map((t) => ({ ...t })) : undefined,
    })),
    notifications: INITIAL_NOTIFICATIONS.map((n, idx) => ({
      ...n,
      createdAt:
        idx === 0
          ? minutesAgoIso(18, baseNowMs)
          : idx === 1
            ? minutesAgoIso(120, baseNowMs)
            : idx === 2
              ? daysAgoIso(1, baseNowMs)
              : daysAgoIso(3, baseNowMs),
    })),
    quote: createDefaultQuoteDraft(baseNowMs, 3),
    reviews: INITIAL_REVIEWS.map((r, idx) => ({
      ...r,
      createdAt:
        idx === 0
          ? daysAgoIso(14, baseNowMs)
          : idx === 1
            ? daysAgoIso(30, baseNowMs)
            : daysAgoIso(60, baseNowMs),
    })),
    chatMessages: createInitialChatMessages(baseNowMs),
    settings: createInitialSettings(baseNowMs),
    ui: createInitialUiState(),
  };
}
