import {
  createDefaultQuoteDraft,
  type AppSettings,
  type CarrierReview,
  type ChatMessage,
  type CompanyInfo,
  type FleetDriver,
  type FleetTruck,
  type NotificationItem,
  type PolicyItem,
  type QuoteDraft,
  type QuoteStep,
  type RequestItem,
  type RevasSeedBundle,
  type ScreenId,
  type TabId,
  type UiState,
  type VaultDocument,
  type VehicleItem,
  type ServiceItem,
} from '../data/mock';
import { daysFromNowIso, formatShortDate } from '../lib/dates';

export type PersistedSliceKey = keyof RevasSeedBundle;

export type ActiveSheet =
  | null
  | { type: 'help' }
  | { type: 'legal-security' }
  | { type: 'call'; title: string; subtitle: string; numberLabel: string }
  | { type: 'message-sarah' }
  | { type: 'policies-list' }
  | { type: 'invoices-list' }
  | { type: 'fleet-truck-details'; truck: FleetTruck }
  | { type: 'fleet-truck-form'; mode: 'add' | 'edit'; truck?: FleetTruck }
  | { type: 'fleet-driver-details'; driver: FleetDriver }
  | { type: 'fleet-driver-form'; mode: 'add' | 'edit'; driver?: FleetDriver }
  | { type: 'write-review' }
  | { type: 'policy-details'; policy: PolicyItem }
  | { type: 'coi-preview'; policy: PolicyItem }
  | { type: 'vehicle-form'; mode: 'add' | 'edit'; vehicle?: VehicleItem }
  | {
      type: 'select-picker';
      title: string;
      options: string[];
      current: string;
      onSelect: (value: string) => void;
    }
  | { type: 'service-details'; service: ServiceItem }
  | { type: 'service-confirm'; service: ServiceItem }
  | {
      type: 'upload-doc';
      presetTitle?: string;
      forMvrRequestId?: string;
      presetCategory?: VaultDocument['category'];
    }
  | { type: 'doc-preview'; doc: VaultDocument }
  | { type: 'doc-menu'; doc: VaultDocument }
  | { type: 'send-shipper'; doc: VaultDocument }
  | { type: 'invoice'; req: RequestItem }
  | { type: 'company-edit' }
  | { type: 'reset-demo-confirm' }
  | { type: 'tutorial' };

export interface ToastMessage {
  id: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface AppState extends RevasSeedBundle {
  activeSheet: ActiveSheet;
  toast: ToastMessage | null;
}

export const TAB_SCREENS: ReadonlyArray<TabId> = [
  'home',
  'services',
  'documents',
  'requests',
  'more',
];

export function isTabScreen(screen: ScreenId): screen is TabId {
  return (TAB_SCREENS as ReadonlyArray<string>).includes(screen);
}

export type AppAction =
  | { type: 'NAVIGATE'; screen: ScreenId }
  | { type: 'SET_UI'; patch: Partial<UiState> }
  | { type: 'TOGGLE_REQUEST_EXPANDED'; id: string }
  | { type: 'SET_SCROLL_POSITION'; key: string; top: number }
  | { type: 'SET_ACTIVE_SHEET'; sheet: ActiveSheet }
  | { type: 'SET_TOAST'; toast: ToastMessage | null }
  | { type: 'UPDATE_COMPANY'; patch: Partial<CompanyInfo> }
  | { type: 'UPDATE_SETTINGS'; patch: Partial<Omit<AppSettings, 'session'>> }
  | { type: 'SIGN_OUT' }
  | { type: 'SIGN_IN'; email: string; timestampIso: string }
  | { type: 'UPSERT_TRUCK'; truck: FleetTruck; isEdit: boolean }
  | { type: 'REMOVE_TRUCK'; id: string }
  | { type: 'UPSERT_DRIVER'; driver: FleetDriver; isEdit: boolean }
  | { type: 'REMOVE_DRIVER'; id: string }
  | { type: 'UPLOAD_DOCUMENT'; doc: VaultDocument; resolvesMedicalAlert?: boolean; mvrRequestId?: string; timestampIso: string; notificationId?: string; timelineId?: string }
  | { type: 'REMOVE_DOCUMENT'; id: string }
  | { type: 'RECORD_DOCUMENT_ACTIVITY'; docId: string; text: string; activityId: string; timestampIso: string }
  | { type: 'MARK_NOTIFICATION_READ'; id: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'REMIND_MEDICAL_CARD'; id: string; timestampIso: string }
  | { type: 'SUBMIT_SERVICE_ORDER'; serviceId: string; title: string; price: string; subtitle: string; requestId: string; refNumber: string; notificationId: string; timelineId: string; timestampIso: string }
  | { type: 'START_OR_RESUME_QUOTE'; step?: QuoteStep; timestampIso: string }
  | { type: 'UPDATE_QUOTE'; patch: Partial<QuoteDraft>; timestampIso: string }
  | { type: 'SET_QUOTE_STEP'; step: QuoteStep; timestampIso: string }
  | { type: 'UPSERT_QUOTE_VEHICLE'; vehicle: VehicleItem; isEdit: boolean; timestampIso: string }
  | { type: 'REMOVE_QUOTE_VEHICLE'; id: string; timestampIso: string }
  | { type: 'TOGGLE_QUOTE_COVERAGE'; id: string; timestampIso: string }
  | { type: 'SAVE_QUOTE_FOR_LATER'; timestampIso: string }
  | { type: 'SUBMIT_QUOTE'; requestId: string; refNumber: string; notificationId: string; timelineId: string; timestampIso: string }
  | { type: 'ADD_REVIEW'; review: CarrierReview }
  | { type: 'ADD_CHAT_MESSAGE'; message: ChatMessage }
  | { type: 'RESTORE_SLICE'; slice: PersistedSliceKey; value: unknown }
  | { type: 'SYNC_REMOTE_SLICE'; slice: PersistedSliceKey; value: unknown }
  | { type: 'REPLACE_ALL_PERSISTED'; bundle: RevasSeedBundle };

export function computeReviewStats(reviews: CarrierReview[]): {
  ratingText: string;
  count: number;
  summarySubtitle: string;
} {
  if (reviews.length === 0) {
    return {
      ratingText: '4.9',
      count: 0,
      summarySubtitle: '0 verified reviews',
    };
  }
  // Baseline blends 3 prior platform samples (avg 4.8) with stored carrier reviews
  // so initial seed reviews preserve 4.9 while new user ratings visibly shift the average.
  const baselineCount = 3;
  const baselineSum = 14.4;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = (baselineSum + sum) / (baselineCount + reviews.length);
  const clamped = Math.min(5, Math.max(1, avg));
  const ratingText = clamped.toFixed(1);
  return {
    ratingText,
    count: reviews.length,
    summarySubtitle: `${ratingText} rating · 2,400+ carriers`,
  };
}

function parsePaidAmount(price: string): string {
  const numeric = price.replace(/[^0-9.]/g, '');
  if (!numeric || Number(numeric) === 0) return '$0.00 Covered';
  const num = Number.parseFloat(numeric);
  if (!Number.isFinite(num)) return `${price} Paid`;
  return `$${num.toFixed(2)} Paid`;
}

function withSyncedFleetCounts(
  company: CompanyInfo,
  trucks: FleetTruck[],
  drivers: FleetDriver[],
): CompanyInfo {
  return {
    ...company,
    powerUnits: trucks.length,
    driversCount: drivers.length,
  };
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'NAVIGATE': {
      const nextActiveTab = isTabScreen(action.screen)
        ? action.screen
        : state.ui.activeTab;
      return {
        ...state,
        activeSheet: null,
        ui: {
          ...state.ui,
          screen: action.screen,
          activeTab: nextActiveTab,
        },
      };
    }

    case 'SET_UI':
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.patch,
        },
      };

    case 'TOGGLE_REQUEST_EXPANDED':
      return {
        ...state,
        ui: {
          ...state.ui,
          requestsExpanded: {
            ...state.ui.requestsExpanded,
            [action.id]: !state.ui.requestsExpanded[action.id],
          },
        },
      };

    case 'SET_SCROLL_POSITION':
      return {
        ...state,
        ui: {
          ...state.ui,
          scrollPositions: {
            ...state.ui.scrollPositions,
            [action.key]: action.top,
          },
        },
      };

    case 'SET_ACTIVE_SHEET':
      return {
        ...state,
        activeSheet: action.sheet,
      };

    case 'SET_TOAST':
      return {
        ...state,
        toast: action.toast,
      };

    case 'UPDATE_COMPANY':
      return {
        ...state,
        company: {
          ...state.company,
          ...action.patch,
        },
        activeSheet: null,
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.patch,
        },
      };

    case 'SIGN_OUT':
      return {
        ...state,
        activeSheet: null,
        settings: {
          ...state.settings,
          session: {
            ...state.settings.session,
            signedIn: false,
          },
        },
      };

    case 'SIGN_IN':
      return {
        ...state,
        activeSheet: null,
        settings: {
          ...state.settings,
          session: {
            signedIn: true,
            userEmail: action.email,
            lastSignedInAt: action.timestampIso,
          },
        },
      };

    case 'UPSERT_TRUCK': {
      const nextTrucks = action.isEdit
        ? state.trucks.map((t) => (t.id === action.truck.id ? action.truck : t))
        : [action.truck, ...state.trucks];
      return {
        ...state,
        trucks: nextTrucks,
        company: withSyncedFleetCounts(state.company, nextTrucks, state.drivers),
        activeSheet: null,
      };
    }

    case 'REMOVE_TRUCK': {
      const nextTrucks = state.trucks.filter((t) => t.id !== action.id);
      return {
        ...state,
        trucks: nextTrucks,
        company: withSyncedFleetCounts(state.company, nextTrucks, state.drivers),
        activeSheet: null,
      };
    }

    case 'UPSERT_DRIVER': {
      const nextDrivers = action.isEdit
        ? state.drivers.map((d) => (d.id === action.driver.id ? action.driver : d))
        : [action.driver, ...state.drivers];
      return {
        ...state,
        drivers: nextDrivers,
        company: withSyncedFleetCounts(state.company, state.trucks, nextDrivers),
        activeSheet: null,
      };
    }

    case 'REMOVE_DRIVER': {
      const nextDrivers = state.drivers.filter((d) => d.id !== action.id);
      return {
        ...state,
        drivers: nextDrivers,
        company: withSyncedFleetCounts(state.company, state.trucks, nextDrivers),
        activeSheet: null,
      };
    }

    case 'UPLOAD_DOCUMENT': {
      const nextDocuments = [action.doc, ...state.documents];
      const lowerTitle = action.doc.title.toLowerCase();
      const resolvesMedical =
        Boolean(action.resolvesMedicalAlert) || lowerTitle.includes('medical');
      const resolvesMvr =
        Boolean(action.mvrRequestId) || lowerTitle.includes('mvr');

      let nextDrivers = state.drivers;
      let nextRequests = state.requests;
      let nextNotifications = state.notifications;
      let nextUi = state.ui;

      if (resolvesMedical) {
        const renewedIso = daysFromNowIso(365, Date.parse(action.timestampIso) || Date.now());
        nextDrivers = state.drivers.map((d) =>
          d.id === 'drv-1'
            ? { ...d, statusTone: 'green', medicalExpiryIso: renewedIso }
            : d,
        );
        nextUi = { ...nextUi, alertResolved: true };
        nextNotifications = nextNotifications.map((n) =>
          n.id === 'notif-1' ? { ...n, read: true } : n,
        );
      }

      if (resolvesMvr) {
        const targetReqId = action.mvrRequestId || 'req-quote';
        nextUi = { ...nextUi, alertResolved: true };
        nextRequests = state.requests.map((r) => {
          if (r.id !== targetReqId) return r;
          return {
            ...r,
            statusLabel: 'In Review',
            statusTone: 'teal',
            filterTags: ['in_progress'],
            actionNeeded: false,
            advisorNote: `MVR received (${formatShortDate(action.timestampIso)}). Sarah Jenkins is finalizing carrier quotes.`,
            timeline: [
              ...(r.timeline ?? []),
              {
                id: action.timelineId || `${targetReqId}-tl`,
                label: 'Updated MVR uploaded to Vault',
                at: action.timestampIso,
              },
            ],
          };
        });
        nextNotifications = nextNotifications.map((n) =>
          n.id === 'notif-2' ? { ...n, read: true } : n,
        );
        if (action.notificationId) {
          nextNotifications = [
            {
              id: action.notificationId,
              title: 'MVR uploaded for review',
              body: `Sarah Jenkins received ${action.doc.title}.`,
              createdAt: action.timestampIso,
              read: false,
              targetScreen: 'requests',
            },
            ...nextNotifications,
          ];
        }
      }

      return {
        ...state,
        documents: nextDocuments,
        drivers: nextDrivers,
        requests: nextRequests,
        notifications: nextNotifications,
        ui: nextUi,
        activeSheet: null,
      };
    }

    case 'REMOVE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter((d) => d.id !== action.id),
        activeSheet: null,
      };

    case 'RECORD_DOCUMENT_ACTIVITY': {
      const nextDocs = state.documents.map((doc) => {
        if (doc.id !== action.docId) return doc;
        return {
          ...doc,
          activities: [
            {
              id: action.activityId,
              text: action.text,
              createdAt: action.timestampIso,
            },
            ...(doc.activities ?? []),
          ],
        };
      });
      return {
        ...state,
        documents: nextDocs,
        activeSheet: null,
      };
    }

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? { ...n, read: true } : n,
        ),
      };

    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };

    case 'REMIND_MEDICAL_CARD': {
      const notif: NotificationItem = {
        id: action.id,
        title: 'Medical card reminder sent',
        body: 'SMS & email upload reminder sent to Marcus Vance.',
        createdAt: action.timestampIso,
        read: false,
        urgent: true,
        targetScreen: 'documents',
      };
      return {
        ...state,
        notifications: [notif, ...state.notifications],
      };
    }

    case 'SUBMIT_SERVICE_ORDER': {
      const newReq: RequestItem = {
        id: action.requestId,
        ref: action.refNumber,
        createdAt: action.timestampIso,
        statusLabel: 'In progress',
        statusTone: 'teal',
        filterTags: ['in_progress'],
        title: action.title,
        subtitle: action.subtitle,
        receiptAmount: parsePaidAmount(action.price),
        timeline: [
          {
            id: action.timelineId,
            label: `${action.title} request submitted (${action.price})`,
            at: action.timestampIso,
          },
        ],
      };

      const newNotif: NotificationItem = {
        id: action.notificationId,
        title: `${action.title} submitted`,
        body: `Your request ${action.refNumber} (${action.price}) is now in progress.`,
        createdAt: action.timestampIso,
        read: false,
        targetScreen: 'requests',
      };

      return {
        ...state,
        requests: [newReq, ...state.requests],
        notifications: [newNotif, ...state.notifications],
        activeSheet: null,
      };
    }

    case 'START_OR_RESUME_QUOTE': {
      const draft =
        state.quote ??
        createDefaultQuoteDraft(
          Date.parse(action.timestampIso) || Date.now(),
          action.step ?? 1,
        );
      const nextQuote: QuoteDraft = action.step
        ? { ...draft, currentStep: action.step, updatedAt: action.timestampIso }
        : draft;
      return {
        ...state,
        quote: nextQuote,
        activeSheet: null,
        ui: {
          ...state.ui,
          screen: 'issue-certificate',
        },
      };
    }

    case 'UPDATE_QUOTE': {
      if (!state.quote) return state;
      return {
        ...state,
        quote: {
          ...state.quote,
          ...action.patch,
          updatedAt: action.timestampIso,
        },
      };
    }

    case 'SET_QUOTE_STEP': {
      if (!state.quote) return state;
      return {
        ...state,
        quote: {
          ...state.quote,
          currentStep: action.step,
          updatedAt: action.timestampIso,
        },
      };
    }

    case 'UPSERT_QUOTE_VEHICLE': {
      if (!state.quote) return state;
      const nextVehicles = action.isEdit
        ? state.quote.vehicles.map((v) => (v.id === action.vehicle.id ? action.vehicle : v))
        : [...state.quote.vehicles, action.vehicle];
      return {
        ...state,
        quote: {
          ...state.quote,
          vehicles: nextVehicles,
          updatedAt: action.timestampIso,
        },
        activeSheet: null,
      };
    }

    case 'REMOVE_QUOTE_VEHICLE': {
      if (!state.quote) return state;
      return {
        ...state,
        quote: {
          ...state.quote,
          vehicles: state.quote.vehicles.filter((v) => v.id !== action.id),
          updatedAt: action.timestampIso,
        },
        activeSheet: null,
      };
    }

    case 'TOGGLE_QUOTE_COVERAGE': {
      if (!state.quote) return state;
      return {
        ...state,
        quote: {
          ...state.quote,
          coverages: state.quote.coverages.map((c) =>
            c.id === action.id && !c.locked ? { ...c, checked: !c.checked } : c,
          ),
          updatedAt: action.timestampIso,
        },
      };
    }

    case 'SAVE_QUOTE_FOR_LATER':
      return {
        ...state,
        quote: state.quote
          ? { ...state.quote, updatedAt: action.timestampIso }
          : null,
        activeSheet: null,
        ui: {
          ...state.ui,
          screen: 'more',
          activeTab: 'more',
        },
      };

    case 'SUBMIT_QUOTE': {
      const draft = state.quote;
      const unitCount = draft?.vehicles.length ?? state.trucks.length;
      const driverCount = draft?.selectedDriverIds.length ?? state.drivers.length;
      const newReq: RequestItem = {
        id: action.requestId,
        ref: action.refNumber,
        createdAt: action.timestampIso,
        statusLabel: 'In progress',
        statusTone: 'teal',
        filterTags: ['in_progress'],
        title: 'Fleet Policy Quote',
        subtitle: `${unitCount} Unit${unitCount === 1 ? '' : 's'} • ${driverCount} Driver${driverCount === 1 ? '' : 's'} • ${draft?.liabilityLimit ?? '$1,000,000 CSL'}`,
        stepProgress: 'Submitted (6 of 6)',
        stepper: {
          steps: [
            { name: 'Submitted', state: 'done' },
            { name: 'Review', state: 'active' },
            { name: 'Done', state: 'pending' },
          ],
        },
        advisorNote:
          draft?.submissionNotes.trim() ||
          `Submitted with ${draft?.trailerType ?? 'Dry Van'} / ${draft?.cargoClass ?? 'General Freight'}. Sarah Jenkins is preparing final quotes.`,
        timeline: [
          {
            id: action.timelineId,
            label: 'Complete 6-step fleet quote submitted',
            at: action.timestampIso,
          },
        ],
      };

      const newNotif: NotificationItem = {
        id: action.notificationId,
        title: 'Fleet Policy Quote submitted',
        body: `Your 6-step quote (${action.refNumber}) has been sent to Sarah Jenkins.`,
        createdAt: action.timestampIso,
        read: false,
        targetScreen: 'requests',
      };

      return {
        ...state,
        quote: null,
        requests: [newReq, ...state.requests],
        notifications: [newNotif, ...state.notifications],
        activeSheet: null,
        ui: {
          ...state.ui,
          screen: 'requests',
          activeTab: 'requests',
          requestsFilter: 'all',
        },
      };
    }

    case 'ADD_REVIEW':
      return {
        ...state,
        reviews: [action.review, ...state.reviews],
        activeSheet: null,
      };

    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.message],
      };

    case 'RESTORE_SLICE': {
      const next = {
        ...state,
        [action.slice]: action.value,
      };
      if (action.slice === 'trucks' || action.slice === 'drivers') {
        next.company = withSyncedFleetCounts(next.company, next.trucks, next.drivers);
      }
      return next;
    }

    case 'SYNC_REMOTE_SLICE':
      return {
        ...state,
        [action.slice]: action.value,
      };

    case 'REPLACE_ALL_PERSISTED':
      return {
        ...state,
        ...action.bundle,
        activeSheet: null,
      };

    default:
      return state;
  }
}
