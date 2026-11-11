import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ADVISOR,
  CARGO_CLASSIFICATIONS,
  COMPANY,
  IN_PROGRESS_FILING,
  INITIAL_COVERAGE_OPTIONS,
  INITIAL_DOCUMENTS,
  INITIAL_DRIVERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REQUESTS,
  INITIAL_REVIEWS,
  INITIAL_TRUCKS,
  INITIAL_VEHICLES,
  type CarrierReview,
  type FleetDriver,
  type FleetTruck,
  type InProgressFiling,
  type NotificationItem,
  type PolicyItem,
  type RequestItem,
  type ScreenId,
  type ServiceItem,
  TRAILER_TYPES,
  type TabId,
  type VaultDocument,
  type VehicleItem,
} from './data/mock';
import { BottomNav } from './components/BottomNav';
import { type ActiveSheet, Overlays } from './components/Overlays';
import { PhoneFrame } from './components/PhoneFrame';
import { SubScreenHeader, TopHeader } from './components/TopHeader';
import { ScreenSkeleton, type ToastAction, type ToastData } from './components/ui';
import { DocumentsScreen } from './screens/DocumentsScreen';
import { FleetScreen } from './screens/FleetScreen';
import { HomeScreen } from './screens/HomeScreen';
import { IssueCertificateScreen } from './screens/IssueCertificateScreen';
import { MoreScreen } from './screens/MoreScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { RequestsScreen } from './screens/RequestsScreen';
import { ReviewsScreen } from './screens/ReviewsScreen';
import { ServicesScreen } from './screens/ServicesScreen';

const UCR_FILING_SERVICE: ServiceItem = {
  id: 'ucr-2025',
  section: 'Registrations & Authority',
  filterGroup: 'Filings',
  title: '2025 UCR Registration',
  description: 'Required annual registration for interstate carriers.',
  tag: { label: 'Due soon', tone: 'red' },
  price: '$176',
  ctaLabel: 'File now',
};

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [screen, setScreen] = useState<ScreenId>('home');
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  // Shared application state
  const [alertResolved, setAlertResolved] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleItem[]>(INITIAL_VEHICLES);
  const [fleetTrucks, setFleetTrucks] = useState<FleetTruck[]>(INITIAL_TRUCKS);
  const [fleetDrivers, setFleetDrivers] = useState<FleetDriver[]>(INITIAL_DRIVERS);
  const [trailerType, setTrailerType] = useState<string>(TRAILER_TYPES[0]);
  const [cargoClass, setCargoClass] = useState<string>(CARGO_CLASSIFICATIONS[0]);
  const [maxCargoValue, setMaxCargoValue] = useState('250,000');
  const [coverages, setCoverages] = useState(INITIAL_COVERAGE_OPTIONS);

  const [documents, setDocuments] = useState<VaultDocument[]>(INITIAL_DOCUMENTS);
  const [requests, setRequests] = useState<RequestItem[]>(INITIAL_REQUESTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [advisorUnreadCount, setAdvisorUnreadCount] = useState(1);
  const [inProgressFiling] = useState<InProgressFiling | null>(IN_PROGRESS_FILING);
  const [reviews, setReviews] = useState<CarrierReview[]>(INITIAL_REVIEWS);

  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  const toastTimerRef = useRef<number | null>(null);
  const loadingTimerRef = useRef<number | null>(null);
  const certScrollRef = useRef<HTMLDivElement | null>(null);
  const homeScrollRef = useRef<HTMLDivElement | null>(null);

  const showToast = useCallback(
    (
      message: string,
      tone: 'success' | 'info' | 'warning' = 'success',
      action?: ToastAction,
    ) => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
      const nextId = Date.now();
      setToast({ id: nextId, message, tone, action });
      toastTimerRef.current = window.setTimeout(
        () => {
          setToast((cur) => (cur?.id === nextId ? null : cur));
        },
        action ? 5000 : 3200,
      );
    },
    [],
  );

  const beginBriefLoading = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsScreenLoading(false);
      return;
    }
    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current);
    }
    setIsScreenLoading(true);
    loadingTimerRef.current = window.setTimeout(() => {
      setIsScreenLoading(false);
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      if (loadingTimerRef.current) window.clearTimeout(loadingTimerRef.current);
    };
  }, []);

  const switchToTab = useCallback(
    (tab: TabId) => {
      if (screen === tab && activeTab === tab) return;
      setActiveTab(tab);
      setScreen(tab);
      beginBriefLoading();
    },
    [screen, activeTab, beginBriefLoading],
  );

  const navigateScreen = useCallback(
    (next: ScreenId) => {
      if (next === screen) return;
      if (
        next === 'home' ||
        next === 'services' ||
        next === 'documents' ||
        next === 'requests' ||
        next === 'more'
      ) {
        setActiveTab(next);
      }
      setScreen(next);
      beginBriefLoading();
    },
    [screen, beginBriefLoading],
  );

  const handleSaveVehicle = (data: Omit<VehicleItem, 'id'>, editId?: string) => {
    if (editId) {
      setVehicles((prev) => prev.map((v) => (v.id === editId ? { ...v, ...data } : v)));
      setActiveSheet(null);
      showToast(`Updated ${data.name}`);
    } else {
      const newVehicle: VehicleItem = {
        id: `v-${Date.now()}`,
        ...data,
      };
      setVehicles((prev) => [...prev, newVehicle]);
      setActiveSheet(null);
      showToast(`Added ${data.name}`);
    }
  };

  const handleRemoveVehicle = (vehicle: VehicleItem) => {
    const idx = vehicles.findIndex((v) => v.id === vehicle.id);
    if (idx === -1) return;
    setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
    showToast(`Removed ${vehicle.name}`, 'info', {
      label: 'Undo',
      onClick: () => {
        setVehicles((cur) => {
          if (cur.some((v) => v.id === vehicle.id)) return cur;
          const restored = [...cur];
          restored.splice(Math.min(idx, restored.length), 0, vehicle);
          return restored;
        });
        showToast(`Restored ${vehicle.name}`, 'success');
      },
    });
  };

  const handleSaveFleetTruck = (data: Omit<FleetTruck, 'id'>, editId?: string) => {
    if (editId) {
      setFleetTrucks((prev) => prev.map((t) => (t.id === editId ? { ...t, ...data } : t)));
      setActiveSheet(null);
      showToast(`Updated ${data.name}`);
    } else {
      const next: FleetTruck = { id: `trk-${Date.now()}`, ...data };
      setFleetTrucks((prev) => [...prev, next]);
      setActiveSheet(null);
      showToast(`Added ${data.name}`);
    }
  };

  const handleRemoveFleetTruck = (truck: FleetTruck) => {
    const idx = fleetTrucks.findIndex((t) => t.id === truck.id);
    if (idx === -1) return;
    setFleetTrucks((prev) => prev.filter((t) => t.id !== truck.id));
    showToast(`Removed ${truck.name}`, 'info', {
      label: 'Undo',
      onClick: () => {
        setFleetTrucks((cur) => {
          if (cur.some((t) => t.id === truck.id)) return cur;
          const restored = [...cur];
          restored.splice(Math.min(idx, restored.length), 0, truck);
          return restored;
        });
        showToast(`Restored ${truck.name}`, 'success');
      },
    });
  };

  const handleSaveFleetDriver = (data: Omit<FleetDriver, 'id'>, editId?: string) => {
    if (editId) {
      setFleetDrivers((prev) => prev.map((d) => (d.id === editId ? { ...d, ...data } : d)));
      setActiveSheet(null);
      showToast(`Updated ${data.name}`);
    } else {
      const next: FleetDriver = { id: `drv-${Date.now()}`, ...data };
      setFleetDrivers((prev) => [...prev, next]);
      setActiveSheet(null);
      showToast(`Added ${data.name}`);
    }
  };

  const handleRemoveFleetDriver = (driver: FleetDriver) => {
    const idx = fleetDrivers.findIndex((d) => d.id === driver.id);
    if (idx === -1) return;
    setFleetDrivers((prev) => prev.filter((d) => d.id !== driver.id));
    showToast(`Removed ${driver.name}`, 'info', {
      label: 'Undo',
      onClick: () => {
        setFleetDrivers((cur) => {
          if (cur.some((d) => d.id === driver.id)) return cur;
          const restored = [...cur];
          restored.splice(Math.min(idx, restored.length), 0, driver);
          return restored;
        });
        showToast(`Restored ${driver.name}`, 'success');
      },
    });
  };

  const handleToggleCoverage = (id: string) => {
    setCoverages((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.locked) return c;
        return { ...c, checked: !c.checked };
      }),
    );
  };

  const handleConfirmService = (service: ServiceItem) => {
    const newReq: RequestItem = {
      id: `req-${Date.now()}`,
      ref: `REV-DOT-${Math.floor(45000 + Math.random() * 4999)}`,
      timestamp: 'Just now',
      statusLabel: 'In Progress',
      statusTone: 'teal',
      filterTags: ['in_progress'],
      title: service.title,
      subtitle: service.description,
      stepProgress: 'Step 1 of 3',
      stepper: {
        steps: [
          { name: 'Submitted', state: 'done' },
          { name: 'Review', state: 'active' },
          { name: 'Done', state: 'pending' },
        ],
      },
    };
    setRequests((prev) => [newReq, ...prev]);
    setActiveSheet(null);
    showToast(`${service.title} requested`);
  };

  const handleConfirmUploadDoc = (
    title: string,
    category: VaultDocument['category'],
    fileName: string,
  ) => {
    const newDoc: VaultDocument = {
      id: `doc-${Date.now()}`,
      category,
      metaLine: `Uploaded today • ${fileName}`,
      statusTone: 'teal',
      title,
      previewSummary: `Document (${fileName}) uploaded for ${COMPANY.name} (USDOT ${COMPANY.usdot}).`,
    };
    setDocuments((prev) => [newDoc, ...prev]);

    const lowerTitle = title.toLowerCase();
    if (
      lowerTitle.includes('marcus') ||
      lowerTitle.includes('mvr') ||
      lowerTitle.includes('medical')
    ) {
      setAlertResolved(true);
      setNotifications((prev) => prev.filter((n) => !n.urgent));
      setFleetDrivers((prev) =>
        prev.map((d) =>
          d.id === 'drv-1'
            ? {
                ...d,
                statusLabel: 'Active',
                statusTone: 'green',
                medicalValidUntil: 'Nov 18, 2026',
              }
            : d,
        ),
      );
      setRequests((prev) =>
        prev.map((r) =>
          r.actionNeeded
            ? {
                ...r,
                actionNeeded: false,
                statusLabel: 'In Review',
                statusTone: 'teal',
                filterTags: ['in_progress'],
                advisorNote: 'Documents received. Reviewing carrier quotes for final rate.',
              }
            : r,
        ),
      );
    }

    setActiveSheet(null);
    showToast(`Saved ${fileName} to Documents`);
  };

  const handleContinueQuote = () => {
    if (vehicles.length === 0) {
      showToast('Add at least one vehicle before continuing', 'warning');
      return;
    }
    showToast('Saved Step 3 — continuing to Driver Schedule', 'success');
    navigateScreen('requests');
  };

  const openCallAdvisor = () =>
    setActiveSheet({
      type: 'call',
      title: ADVISOR.name,
      subtitle: ADVISOR.role,
      numberLabel: ADVISOR.phone,
    });

  const openMessageSarah = () => {
    setAdvisorUnreadCount(0);
    setActiveSheet({ type: 'message-sarah' });
  };

  const handleSelectNotification = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)),
    );
    if (item.urgent && item.targetScreen) {
      navigateScreen(item.targetScreen);
    }
  };

  const handleSubmitReview = (rating: number, text: string) => {
    const trimmed = text.trim();
    if (trimmed) {
      const initials = COMPANY.name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
      setReviews((prev) => [
        {
          id: `rev-${Date.now()}`,
          initials: initials || 'AH',
          company: COMPANY.name,
          rating,
          timeAgo: 'Just now',
          text: trimmed,
        },
        ...prev,
      ]);
    }
    setActiveSheet(null);
    showToast('Review submitted — thank you!', 'success');
  };

  const isQuoteFlow = screen === 'issue-certificate';
  const hidesTopHeader =
    screen === 'notifications' || screen === 'fleet' || screen === 'reviews';
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <PhoneFrame
      toast={toast}
      onDismissToast={() => setToast(null)}
      overlays={
        <Overlays
          sheet={activeSheet}
          onClose={() => setActiveSheet(null)}
          onOpenSheet={setActiveSheet}
          onSaveVehicle={handleSaveVehicle}
          onRemoveVehicle={handleRemoveVehicle}
          onSaveFleetTruck={handleSaveFleetTruck}
          onRemoveFleetTruck={handleRemoveFleetTruck}
          onSaveFleetDriver={handleSaveFleetDriver}
          onRemoveFleetDriver={handleRemoveFleetDriver}
          onConfirmService={handleConfirmService}
          onConfirmUploadDoc={handleConfirmUploadDoc}
          onSubmitReview={handleSubmitReview}
          onShowToast={showToast}
        />
      }
    >
      {isQuoteFlow ? (
        <SubScreenHeader
          title="Fleet Policy Quote"
          onBack={() => navigateScreen(activeTab)}
          onOpenProfile={() => navigateScreen('profile')}
        />
      ) : hidesTopHeader ? null : (
        <TopHeader
          hasUnreadNotifications={hasUnread}
          isProfileActive={screen === 'profile'}
          showBottomBorder={screen !== 'home'}
          onOpenNotifications={() => navigateScreen('notifications')}
          onOpenProfile={() => navigateScreen(screen === 'profile' ? activeTab : 'profile')}
          onLogoClick={() => {
            if (screen === 'home') {
              homeScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              switchToTab('home');
            }
          }}
        />
      )}

      <main className="flex-1 min-h-0 w-full flex flex-col bg-[#F6F8FC] relative overflow-hidden">
        {isScreenLoading ? (
          <ScreenSkeleton />
        ) : (
          <>
            {screen === 'home' && (
              <HomeScreen
                alertResolved={alertResolved}
                scrollContainerRef={homeScrollRef}
                onNavigate={navigateScreen}
                onSwitchTab={switchToTab}
                onUploadMedicalCard={() =>
                  setActiveSheet({
                    type: 'upload-doc',
                    presetTitle: 'DOT Medical Card — Marcus Vance',
                  })
                }
                onFileUcrNow={() =>
                  setActiveSheet({ type: 'service-confirm', service: UCR_FILING_SERVICE })
                }
                onOpenPolicyDetails={(policy: PolicyItem) =>
                  setActiveSheet({ type: 'policy-details', policy })
                }
                onCallAdvisor={openCallAdvisor}
                onOpenHelp={() => setActiveSheet({ type: 'help' })}
              />
            )}

            {screen === 'issue-certificate' && (
              <IssueCertificateScreen
                vehicles={vehicles}
                trailerType={trailerType}
                cargoClass={cargoClass}
                maxCargoValue={maxCargoValue}
                coverages={coverages}
                onBackHome={() => switchToTab('home')}
                onAddVehicle={() => setActiveSheet({ type: 'vehicle-form', mode: 'add' })}
                onEditVehicle={(vehicle) =>
                  setActiveSheet({ type: 'vehicle-form', mode: 'edit', vehicle })
                }
                onOpenSelectPicker={(title, options, current, onSelect) =>
                  setActiveSheet({
                    type: 'select-picker',
                    title,
                    options,
                    current,
                    onSelect,
                  })
                }
                onChangeTrailerType={setTrailerType}
                onChangeCargoClass={setCargoClass}
                onChangeMaxCargoValue={setMaxCargoValue}
                onToggleCoverage={handleToggleCoverage}
                onSaveLater={() => {
                  showToast('Quote saved (Step 3 of 6)');
                  switchToTab('home');
                }}
                onContinueDrivers={handleContinueQuote}
                scrollContainerRef={certScrollRef}
              />
            )}

            {screen === 'services' && (
              <ServicesScreen
                onInspectService={(service) =>
                  setActiveSheet({ type: 'service-details', service })
                }
                onSelectService={(service) =>
                  setActiveSheet({ type: 'service-confirm', service })
                }
                onFileUcrNow={() =>
                  setActiveSheet({ type: 'service-confirm', service: UCR_FILING_SERVICE })
                }
              />
            )}

            {screen === 'documents' && (
              <DocumentsScreen
                documents={documents}
                alertResolved={alertResolved}
                onOpenUploadSheet={(presetTitle) =>
                  setActiveSheet({ type: 'upload-doc', presetTitle })
                }
                onPreviewDocument={(doc) => setActiveSheet({ type: 'doc-preview', doc })}
                onOpenDocMenu={(doc) => setActiveSheet({ type: 'doc-menu', doc })}
              />
            )}

            {screen === 'requests' && (
              <RequestsScreen
                requests={requests}
                onProvideInfo={() =>
                  setActiveSheet({
                    type: 'upload-doc',
                    presetTitle: 'MVR for Marcus Vance',
                  })
                }
                onMessageSarah={openMessageSarah}
                onViewInvoice={(req) => setActiveSheet({ type: 'invoice', req })}
                onDownloadNotice={(req) =>
                  showToast(`Downloaded filing notice (${req.ref})`)
                }
              />
            )}

            {screen === 'more' && (
              <MoreScreen
                truckCount={fleetTrucks.length}
                driverCount={fleetDrivers.length}
                advisorUnreadCount={advisorUnreadCount}
                inProgressFiling={inProgressFiling}
                onContinueQuote={() => navigateScreen('issue-certificate')}
                onOpenFleet={() => navigateScreen('fleet')}
                onOpenPolicies={() => setActiveSheet({ type: 'policies-list' })}
                onOpenReviews={() => navigateScreen('reviews')}
                onOpenInvoices={() => setActiveSheet({ type: 'invoices-list' })}
                onMessageSarah={openMessageSarah}
                onOpenHelp={() => setActiveSheet({ type: 'help' })}
                onOpenProfile={() => navigateScreen('profile')}
                onOpenLegalSecurity={() => setActiveSheet({ type: 'legal-security' })}
              />
            )}

            {screen === 'fleet' && (
              <FleetScreen
                trucks={fleetTrucks}
                drivers={fleetDrivers}
                onBack={() => navigateScreen('more')}
                onSelectTruck={(truck) =>
                  setActiveSheet({ type: 'fleet-truck-details', truck })
                }
                onSelectDriver={(driver) =>
                  setActiveSheet({ type: 'fleet-driver-details', driver })
                }
                onAddTruck={() => setActiveSheet({ type: 'fleet-truck-form', mode: 'add' })}
                onAddDriver={() => setActiveSheet({ type: 'fleet-driver-form', mode: 'add' })}
              />
            )}

            {screen === 'reviews' && (
              <ReviewsScreen
                reviews={reviews}
                onBack={() => navigateScreen(activeTab)}
                onWriteReview={() => setActiveSheet({ type: 'write-review' })}
              />
            )}

            {screen === 'profile' && (
              <ProfileScreen
                onBack={() => navigateScreen(activeTab)}
                onCallAdvisor={openCallAdvisor}
                onOpenHelp={() => setActiveSheet({ type: 'help' })}
                onSignOut={() => showToast('Demo mode — session stays active', 'info')}
              />
            )}

            {screen === 'notifications' && (
              <NotificationsScreen
                notifications={notifications}
                onBack={() => navigateScreen(activeTab)}
                onSelectNotification={handleSelectNotification}
              />
            )}
          </>
        )}
      </main>

      {!isQuoteFlow && (
        <BottomNav
          activeTab={screen === 'profile' || screen === 'notifications' ? null : activeTab}
          hasMoreBadge={Boolean(inProgressFiling)}
          onSelectTab={switchToTab}
        />
      )}
    </PhoneFrame>
  );
}

export default App;
