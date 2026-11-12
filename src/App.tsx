import { useRef } from 'react';
import {
  ADVISOR,
  type NotificationItem,
  type PolicyItem,
  type ScreenId,
  type ServiceItem,
  type TabId,
} from './data/mock';
import {
  useChat,
  useCompany,
  useDocuments,
  useFleet,
  useNotifications,
  useQuote,
  useRequests,
  useReviews,
  useSettings,
  useUiState,
} from './hooks';
import { AppStoreProvider } from './store/AppStore';
import { useAppStore } from './store/context';
import { BottomNav } from './components/BottomNav';
import { Overlays } from './components/Overlays';
import { PhoneFrame } from './components/PhoneFrame';
import { SignInScreen } from './components/SignInScreen';
import { SubScreenHeader, TopHeader } from './components/TopHeader';
import { type ToastData } from './components/ui';
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

function AppShell() {
  const { state, dispatch, showToast, dismissToast, openSheet, closeSheet } = useAppStore();
  const { company, policies, truckCount, driverCount, updateCompany } = useCompany();
  const { trucks, drivers, saveTruck, deleteTruck, saveDriver, deleteDriver } = useFleet();
  const { documents, uploadDocument, deleteDocument, recordDocumentActivity } = useDocuments();
  const { requests, submitServiceOrder } = useRequests();
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    sendMedicalReminder,
  } = useNotifications();
  const {
    quote,
    hasQuoteInProgress,
    startOrResumeQuote,
    updateQuote,
    setQuoteStep,
    saveQuoteVehicle,
    deleteQuoteVehicle,
    toggleCoverage,
    saveForLater,
    submitQuote,
  } = useQuote();
  const { reviews, ratingText, reviewCount, summarySubtitle, submitReview } = useReviews();
  const { messages: chatMessages, sendMessage: sendChatMessage } = useChat();
  const {
    settings,
    setReduceMotion,
    setShowTutorial,
    signOut,
    signIn,
    resetDemoData,
  } = useSettings();
  const { ui, navigate, setUiPatch, toggleRequestExpanded } = useUiState();

  const certScrollRef = useRef<HTMLDivElement | null>(null);
  const homeScrollRef = useRef<HTMLDivElement | null>(null);

  const openCallAdvisor = () =>
    openSheet({
      type: 'call',
      title: ADVISOR.name,
      subtitle: ADVISOR.role,
      numberLabel: ADVISOR.phone,
    });

  const handleSelectNotification = (item: NotificationItem) => {
    if (!item.read) {
      markRead(item.id);
    }
    if (item.targetScreen) {
      navigate(item.targetScreen);
    }
  };

  const handleHomeNavigate = (target: ScreenId) => {
    if (target === 'issue-certificate') {
      startOrResumeQuote();
    } else {
      navigate(target);
    }
  };

  const switchToTab = (tab: TabId) => {
    navigate(tab);
  };

  const toastData: ToastData | null = state.toast
    ? {
        id: state.toast.id,
        message: state.toast.text,
        tone: 'success',
        action:
          state.toast.actionLabel && state.toast.onAction
            ? { label: state.toast.actionLabel, onClick: state.toast.onAction }
            : undefined,
      }
    : null;

  const isQuoteFlow = ui.screen === 'issue-certificate' && quote !== null;
  const hidesTopHeader =
    !settings.session.signedIn ||
    ui.screen === 'notifications' ||
    ui.screen === 'fleet' ||
    ui.screen === 'reviews';
  const hasUnread = unreadCount > 0;
  const advisorUnreadCount = notifications.some((n) => n.id === 'notif-2' && !n.read) ? 1 : 0;

  return (
    <PhoneFrame
      toast={toastData}
      onDismissToast={dismissToast}
      reduceMotion={settings.reduceMotion}
      overlays={
        <Overlays
          sheet={state.activeSheet}
          company={company}
          policies={policies}
          requests={requests}
          documents={documents}
          trucks={trucks}
          drivers={drivers}
          quote={quote}
          chatMessages={chatMessages}
          onClose={closeSheet}
          onOpenSheet={openSheet}
          onSaveVehicle={(vehicle, editId) => saveQuoteVehicle({ ...vehicle, id: editId }, Boolean(editId))}
          onRemoveVehicle={(vehicle) => deleteQuoteVehicle(vehicle.id)}
          onSaveFleetTruck={(truck, editId) => saveTruck({ ...truck, id: editId }, Boolean(editId))}
          onRemoveFleetTruck={(truck) => deleteTruck(truck.id)}
          onSaveFleetDriver={(driver, editId) => saveDriver({ ...driver, id: editId }, Boolean(editId))}
          onRemoveFleetDriver={(driver) => deleteDriver(driver.id)}
          onConfirmService={(service) =>
            submitServiceOrder({
              id: service.id,
              title: service.title,
              price: service.price,
            })
          }
          onConfirmUploadDoc={uploadDocument}
          onDeleteDocument={(doc) => deleteDocument(doc.id)}
          onRecordDocActivity={recordDocumentActivity}
          onSubmitReview={submitReview}
          onSendChatMessage={sendChatMessage}
          onSaveCompany={updateCompany}
          onResetDemoData={resetDemoData}
          onCloseTutorial={() => {
            dispatch({ type: 'UPDATE_SETTINGS', patch: { showTutorial: false } });
            closeSheet();
          }}
          onShowToast={(msg) => showToast(msg)}
        />
      }
    >
      {!settings.session.signedIn ? (
        <SignInScreen
          defaultEmail={settings.session.userEmail}
          companyName={company.name}
          usdot={company.usdot}
          mc={company.mc}
          onSignIn={signIn}
          onResetDemo={() => openSheet({ type: 'reset-demo-confirm' })}
        />
      ) : (
        <>
          {isQuoteFlow ? (
            <SubScreenHeader
              title="Fleet Policy Quote"
              onBack={() => navigate(ui.activeTab)}
              onOpenProfile={() => navigate('profile')}
            />
          ) : hidesTopHeader ? null : (
            <TopHeader
              hasUnreadNotifications={hasUnread}
              isProfileActive={ui.screen === 'profile'}
              showBottomBorder={ui.screen !== 'home'}
              onOpenNotifications={() => navigate('notifications')}
              onOpenProfile={() =>
                navigate(ui.screen === 'profile' ? ui.activeTab : 'profile')
              }
              onLogoClick={() => {
                if (ui.screen === 'home') {
                  homeScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  switchToTab('home');
                }
              }}
            />
          )}

          <main className="flex-1 min-h-0 w-full flex flex-col bg-[#F6F8FC] relative overflow-hidden">
            {ui.screen === 'home' && (
              <HomeScreen
                company={company}
                truckCount={truckCount}
                driverCount={driverCount}
                drivers={drivers}
                policies={policies}
                reviewsRatingText={ratingText}
                alertResolved={ui.alertResolved}
                scrollContainerRef={homeScrollRef}
                onNavigate={handleHomeNavigate}
                onSwitchTab={switchToTab}
                onUploadMedicalCard={() =>
                  openSheet({
                    type: 'upload-doc',
                    presetTitle: 'DOT Medical Card — Marcus Vance',
                    presetCategory: 'Permits',
                  })
                }
                onRemindMedicalCard={sendMedicalReminder}
                onFileUcrNow={() =>
                  openSheet({ type: 'service-confirm', service: UCR_FILING_SERVICE })
                }
                onOpenPolicyDetails={(policy: PolicyItem) =>
                  openSheet({ type: 'policy-details', policy })
                }
                onCallAdvisor={openCallAdvisor}
                onOpenHelp={() => openSheet({ type: 'help' })}
              />
            )}

            {ui.screen === 'issue-certificate' && quote && (
              <IssueCertificateScreen
                company={company}
                quote={quote}
                drivers={drivers}
                onBackHome={() => switchToTab('home')}
                onStepChange={setQuoteStep}
                onUpdateQuote={updateQuote}
                onAddVehicle={() => openSheet({ type: 'vehicle-form', mode: 'add' })}
                onEditVehicle={(vehicle) =>
                  openSheet({ type: 'vehicle-form', mode: 'edit', vehicle })
                }
                onOpenSelectPicker={(title, options, current, onSelect) =>
                  openSheet({
                    type: 'select-picker',
                    title,
                    options,
                    current,
                    onSelect,
                  })
                }
                onToggleCoverage={toggleCoverage}
                onSaveLater={saveForLater}
                onSubmitQuote={submitQuote}
                scrollContainerRef={certScrollRef}
              />
            )}

            {ui.screen === 'services' && (
              <ServicesScreen
                search={ui.servicesSearch}
                onSearchChange={(servicesSearch) => setUiPatch({ servicesSearch })}
                activeFilter={ui.servicesFilter}
                onFilterChange={(servicesFilter) => setUiPatch({ servicesFilter })}
                onInspectService={(service) =>
                  openSheet({ type: 'service-details', service })
                }
                onSelectService={(service) =>
                  openSheet({ type: 'service-confirm', service })
                }
                onFileUcrNow={() =>
                  openSheet({ type: 'service-confirm', service: UCR_FILING_SERVICE })
                }
              />
            )}

            {ui.screen === 'documents' && (
              <DocumentsScreen
                documents={documents}
                selectedFilter={ui.documentsFilter}
                onFilterChange={(documentsFilter) => setUiPatch({ documentsFilter })}
                alertResolved={ui.alertResolved}
                onOpenUploadSheet={(options) =>
                  openSheet({
                    type: 'upload-doc',
                    presetTitle: options?.presetTitle,
                    forMvrRequestId: options?.forMvrRequestId,
                    presetCategory: options?.presetCategory,
                  })
                }
                onPreviewDocument={(doc) => openSheet({ type: 'doc-preview', doc })}
                onOpenDocMenu={(doc) => openSheet({ type: 'doc-menu', doc })}
              />
            )}

            {ui.screen === 'requests' && (
              <RequestsScreen
                requests={requests}
                activeFilter={ui.requestsFilter}
                expandedMap={ui.requestsExpanded}
                onFilterChange={(requestsFilter) => setUiPatch({ requestsFilter })}
                onToggleExpand={toggleRequestExpanded}
                onProvideInfo={(requestId) =>
                  openSheet({
                    type: 'upload-doc',
                    presetTitle: 'MVR for Marcus Vance',
                    forMvrRequestId: requestId,
                    presetCategory: 'Permits',
                  })
                }
                onMessageSarah={() => openSheet({ type: 'message-sarah' })}
                onViewInvoice={(req) => openSheet({ type: 'invoice', req })}
                onDownloadNotice={(req) =>
                  showToast(`Downloaded filing notice (${req.ref})`)
                }
              />
            )}

            {ui.screen === 'more' && (
              <MoreScreen
                company={company}
                truckCount={truckCount}
                driverCount={driverCount}
                policyCount={policies.length}
                reviewsSummarySubtitle={summarySubtitle}
                advisorUnreadCount={advisorUnreadCount}
                quoteDraft={quote}
                onContinueQuote={() => startOrResumeQuote()}
                onOpenFleet={() => navigate('fleet')}
                onOpenPolicies={() => openSheet({ type: 'policies-list' })}
                onOpenReviews={() => navigate('reviews')}
                onOpenInvoices={() => openSheet({ type: 'invoices-list' })}
                onMessageSarah={() => openSheet({ type: 'message-sarah' })}
                onOpenHelp={() => openSheet({ type: 'help' })}
                onOpenProfile={() => navigate('profile')}
                onOpenLegalSecurity={() => openSheet({ type: 'legal-security' })}
                onSignOut={signOut}
              />
            )}

            {ui.screen === 'fleet' && (
              <FleetScreen
                companyName={company.name}
                trucks={trucks}
                drivers={drivers}
                segment={ui.fleetSegment}
                onSegmentChange={(fleetSegment) => setUiPatch({ fleetSegment })}
                onBack={() => navigate('more')}
                onSelectTruck={(truck) =>
                  openSheet({ type: 'fleet-truck-details', truck })
                }
                onSelectDriver={(driver) =>
                  openSheet({ type: 'fleet-driver-details', driver })
                }
                onAddTruck={() => openSheet({ type: 'fleet-truck-form', mode: 'add' })}
                onAddDriver={() => openSheet({ type: 'fleet-driver-form', mode: 'add' })}
              />
            )}

            {ui.screen === 'reviews' && (
              <ReviewsScreen
                reviews={reviews}
                ratingText={ratingText}
                reviewCount={reviewCount}
                onBack={() => navigate(ui.activeTab)}
                onWriteReview={() => openSheet({ type: 'write-review' })}
              />
            )}

            {ui.screen === 'profile' && (
              <ProfileScreen
                company={company}
                truckCount={truckCount}
                driverCount={driverCount}
                settings={settings}
                onBack={() => navigate(ui.activeTab)}
                onCallAdvisor={openCallAdvisor}
                onOpenHelp={() => openSheet({ type: 'help' })}
                onEditCompany={() => openSheet({ type: 'company-edit' })}
                onToggleReduceMotion={setReduceMotion}
                onToggleShowTutorial={setShowTutorial}
                onRequestResetDemo={() => openSheet({ type: 'reset-demo-confirm' })}
                onSignOut={signOut}
              />
            )}

            {ui.screen === 'notifications' && (
              <NotificationsScreen
                companyName={company.name}
                notifications={notifications}
                filter={ui.notificationsFilter}
                onFilterChange={(notificationsFilter) =>
                  setUiPatch({ notificationsFilter })
                }
                onBack={() => navigate(ui.activeTab)}
                onSelectNotification={handleSelectNotification}
                onMarkAllRead={markAllRead}
              />
            )}
          </main>

          {!isQuoteFlow && (
            <BottomNav
              activeTab={
                ui.screen === 'profile' || ui.screen === 'notifications'
                  ? null
                  : ui.activeTab
              }
              hasMoreBadge={hasQuoteInProgress}
              onSelectTab={switchToTab}
            />
          )}
        </>
      )}
    </PhoneFrame>
  );
}

export function App() {
  return (
    <AppStoreProvider>
      <AppShell />
    </AppStoreProvider>
  );
}

export default App;
