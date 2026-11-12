import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FilePlus2,
  HelpCircle,
  Phone,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-react';
import {
  ADVISOR,
  HOME_CONTENT,
  HOME_IMAGES,
  REVIEWS_SUMMARY,
  type CompanyInfo,
  type FleetDriver,
  type PolicyItem,
  type ScreenId,
  type TabId,
} from '../data/mock';
import { useScrollPersistence } from '../hooks';
import { formatExpiryCountdown, formatShortDate } from '../lib/dates';
import { ResponsivePhoto } from '../components/ui';

interface HomeScreenProps {
  company: CompanyInfo;
  truckCount: number;
  driverCount: number;
  drivers: FleetDriver[];
  policies: PolicyItem[];
  reviewsRatingText: string;
  alertResolved: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  onNavigate: (screen: ScreenId) => void;
  onSwitchTab: (tab: TabId) => void;
  onUploadMedicalCard: () => void;
  onRemindMedicalCard: () => void;
  onFileUcrNow: () => void;
  onOpenPolicyDetails: (policy: PolicyItem) => void;
  onCallAdvisor: () => void;
  onOpenHelp: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  company,
  truckCount,
  driverCount,
  drivers,
  policies,
  reviewsRatingText,
  alertResolved,
  scrollContainerRef,
  onNavigate,
  onSwitchTab,
  onUploadMedicalCard,
  onRemindMedicalCard,
  onFileUcrNow,
  onOpenPolicyDetails,
  onCallAdvisor,
  onOpenHelp,
}) => {
  const { scrollRef, onScroll } = useScrollPersistence('home', scrollContainerRef);

  const urgentDriver =
    drivers.find((d) => d.id === 'drv-1') ?? drivers[0];
  const dynamicAlertHeadline = urgentDriver
    ? `Medical card ${formatExpiryCountdown(urgentDriver.medicalExpiryIso).replace(/^Expires/, 'expires')}`
    : HOME_CONTENT.alertHeadline;
  const dynamicAlertSubline = urgentDriver
    ? `${urgentDriver.name} · ${formatShortDate(urgentDriver.medicalExpiryIso)}`
    : HOME_CONTENT.alertSubline;

  const renderQuickActionIcon = (id: 'quote' | 'filing' | 'document') => {
    if (id === 'quote') return <Truck className="w-5 h-5 text-[#14B8A6] stroke-[2]" />;
    if (id === 'filing') return <ShieldCheck className="w-5 h-5 text-[#14B8A6] stroke-[2]" />;
    return <FilePlus2 className="w-5 h-5 text-[#14B8A6] stroke-[2]" />;
  };

  const handleQuickAction = (id: 'quote' | 'filing' | 'document') => {
    if (id === 'quote') onNavigate('issue-certificate');
    else if (id === 'filing') onSwitchTab('services');
    else onUploadMedicalCard();
  };

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="flex-1 min-h-0 scroll-area bg-[#F6F8FC] pb-6"
    >
      {/* 1. Hero Company Card */}
      <div className="pt-4 px-4 pb-0">
        <section
          className="relative w-full rounded-[24px] overflow-hidden bg-[#0F2A3F] text-white flex flex-col justify-end p-[18px] shadow-[0_8px_24px_rgba(15,42,63,0.18)]"
          style={{ height: 'clamp(210px, 28dvh, 260px)' }}
        >
          <ResponsivePhoto
            asset={HOME_IMAGES.heroTruck}
            lazy={false}
            priority
            fallbackSolid
            className="absolute inset-0 w-full h-full"
            imgClassName="object-cover"
            style={{ objectPosition: '50% 35%', transform: 'none' }}
          />

          {/* Gradient on bottom 120px only so upper sunrise and truck stay uncovered */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px]"
            style={{
              background:
                'linear-gradient(to top, rgba(15, 42, 63, 0.96) 0%, rgba(15, 42, 63, 0.7) 55%, rgba(15, 42, 63, 0) 100%)',
            }}
          />

          <div className="relative z-10">
            <p className="text-[14px] font-normal text-[#99F6E4] leading-[1.35]">
              {HOME_CONTENT.greeting}
            </p>
            <h1 className="mt-1 text-[26px] font-medium text-white leading-[1.2] tracking-[-0.015em]">
              {company.name}
            </h1>
            <p className="mt-[14px] flex items-center gap-2 text-[14px] font-normal text-[#BFDBFE] leading-[1.35]">
              <span aria-hidden="true" className="w-2 h-2 rounded-full bg-[#34D399] shrink-0" />
              <span>
                {company.status} · {truckCount} truck{truckCount === 1 ? '' : 's'} · {driverCount} driver{driverCount === 1 ? '' : 's'}
              </span>
            </p>
          </div>
        </section>
      </div>

      {/* 2. Needs-Attention Alert (16px below hero, no overlap) */}
      <div
        className="px-4 mt-4 fade-up"
        style={{ animationDelay: '60ms' }}
      >
        {!alertResolved ? (
          <div
            className="rounded-2xl bg-white p-[14px] shadow-[0_8px_24px_rgba(15,42,63,0.06)] flex flex-wrap items-center justify-between gap-2.5"
            style={{ border: '0.5px solid #FCA5A5' }}
          >
            <div className="flex items-center gap-2.5 min-w-[160px] flex-1">
              <div className="w-10 h-10 rounded-full bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-[18px] h-[18px] stroke-[2.2]" />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-[14px] font-medium text-[#0F172A] leading-[1.3]">
                  {dynamicAlertHeadline}
                </h2>
                <p className="text-[13px] text-[#64748B] leading-[1.3] mt-0.5 truncate">
                  {dynamicAlertSubline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              <button
                type="button"
                onClick={onRemindMedicalCard}
                className="h-10 px-3 rounded-[10px] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#B91C1C] text-[13px] font-medium whitespace-nowrap shrink-0 pressable cursor-pointer transition-colors"
                style={{ border: '0.5px solid #FCA5A5' }}
              >
                Remind
              </button>
              <button
                type="button"
                onClick={onUploadMedicalCard}
                className="h-10 px-4 rounded-[10px] bg-[#B91C1C] hover:bg-[#991B1B] text-white text-[14px] font-semibold whitespace-nowrap shrink-0 pressable cursor-pointer transition-colors"
              >
                {HOME_CONTENT.alertUploadLabel}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#D9F2EA] p-[14px] shadow-[0_8px_24px_rgba(15,42,63,0.08)] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#0B6B5A] shrink-0" />
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-[#0F172A]">
                {HOME_CONTENT.resolvedTitle}
              </div>
              <div className="text-[13px] text-[#334155]">
                {HOME_CONTENT.resolvedSubtitle}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Quick Actions: 3 Image Tiles (16px below alert card) */}
      <section
        className="mt-4 fade-up"
        style={{ animationDelay: '120ms' }}
      >
        <div className="px-4">
          <h2 className="text-[18px] font-semibold text-[#0F172A] tracking-tight">
            {HOME_CONTENT.quickActionsTitle}
          </h2>
        </div>

        <div className="mt-3 flex items-stretch gap-2.5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 scroll-pl-4 py-1">
          {HOME_CONTENT.quickActions.map((tile) => (
            <button
              key={tile.id}
              type="button"
              onClick={() => handleQuickAction(tile.id)}
              className="shrink-0 w-[110px] @[360px]:flex-1 min-w-[110px] h-[120px] rounded-2xl overflow-hidden relative snap-start text-left pressable cursor-pointer shadow-[0_8px_20px_rgba(15,42,63,0.10)]"
            >
              <ResponsivePhoto
                asset={tile.image}
                lazy
                className="absolute inset-0 w-full h-full"
                imgClassName="object-cover"
                style={{ objectPosition: tile.objectPosition }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#0F2A3F]/95 via-[#0F2A3F]/45 to-[#0F2A3F]/10"
              />
              <div className="relative z-10 h-full p-3 flex flex-col justify-end gap-1.5">
                {renderQuickActionIcon(tile.id)}
                <span className="text-[14px] font-semibold text-white leading-tight">
                  {tile.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 5. Promo Banner: Renew UCR */}
      <section
        className="px-4 mt-4 mb-5 fade-up"
        style={{ animationDelay: '240ms' }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={onFileUcrNow}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onFileUcrNow();
            }
          }}
          aria-label="Renew your UCR before the deadline — File now"
          className="relative block w-full h-[168px] rounded-[20px] overflow-hidden bg-[#0F2A3F] text-left shadow-[0_8px_24px_rgba(15,42,63,0.14)] pressable cursor-pointer group"
        >
          <ResponsivePhoto
            asset={HOME_CONTENT.promoBanner.image}
            lazy
            fallbackSolid
            className="absolute inset-0 w-full h-full"
            imgClassName="object-cover"
            style={{ objectPosition: 'right center' }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(15, 42, 63, 0.96) 0%, rgba(15, 42, 63, 0.88) 45%, rgba(15, 42, 63, 0.15) 100%)',
            }}
          />
          <div className="relative z-10 h-full p-[18px]">
            <div className="h-full max-w-[205px] flex flex-col justify-between">
              <div className="flex flex-col items-start">
                <span
                  className="inline-block rounded-full text-[12px] font-medium leading-[1.2] text-[#5EEAD4]"
                  style={{
                    backgroundColor: 'rgba(20, 184, 166, 0.16)',
                    padding: '3px 10px',
                  }}
                >
                  {HOME_CONTENT.promoBanner.badge}
                </span>
                <h2 className="mt-[10px] text-[18px] font-medium text-white leading-[1.25] line-clamp-3">
                  {HOME_CONTENT.promoBanner.title}
                </h2>
              </div>

              <span className="self-start h-10 px-4 rounded-[10px] bg-[#1FB5A0] group-hover:bg-[#2CC4AE] text-[#04342C] text-[14px] font-medium inline-flex items-center gap-1.5 whitespace-nowrap transition-colors">
                <span>{HOME_CONTENT.promoBanner.buttonLabel}</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Policies Horizontal Snap-Scroll Carousel */}
      <section
        className="fade-up"
        style={{ animationDelay: '300ms' }}
      >
        <div className="px-4">
          <h2 className="text-[18px] font-semibold text-[#0F172A] tracking-tight">
            {HOME_CONTENT.policiesTitle}
          </h2>
          <p className="text-[14px] text-[#475569] mt-0.5">
            {HOME_CONTENT.policiesSubtitle}
          </p>
        </div>

        <div className="mt-2.5 flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 scroll-pl-4 py-1.5">
          {policies.map((policy) => (
            <button
              key={policy.id}
              type="button"
              onClick={() => onOpenPolicyDetails(policy)}
              className="shrink-0 w-[264px] snap-start rounded-2xl bg-white overflow-hidden shadow-[0_8px_24px_rgba(15,42,63,0.08)] text-left pressable cursor-pointer"
            >
              <div className="relative h-20 w-full">
                <ResponsivePhoto
                  asset={policy.image}
                  lazy
                  className="w-full h-full"
                  imgClassName="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0F2A3F]/75 via-[#0F2A3F]/20 to-transparent"
                />
                <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#0B6B5A] text-white px-2.5 py-0.5 text-[12px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
                  {policy.status}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div>
                  <h3 className="text-[16px] font-bold text-[#0F172A] leading-snug truncate">
                    {policy.name}
                  </h3>
                  <p className="text-[14px] text-[#475569] mt-0.5 truncate">
                    {policy.carrier}
                  </p>
                </div>

                <div className="pt-1 flex items-baseline justify-between gap-2">
                  <span className="text-[12px] font-medium text-[#475569]">
                    Valid until {policy.validThruValue}
                  </span>
                  <span className="text-[15px] font-bold text-[#0F172A] shrink-0">
                    {policy.coverageValue}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 7. Advisor Row (with Help moved here) */}
      <div
        className="px-4 mt-6 fade-up"
        style={{ animationDelay: '360ms' }}
      >
        <div className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(15,42,63,0.08)] space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <ResponsivePhoto
                  asset={HOME_IMAGES.advisor}
                  lazy
                  className="w-12 h-12 rounded-full"
                  imgClassName="object-cover object-top"
                />
                <span
                  aria-label="Online"
                  className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#14B8A6] ring-2 ring-white"
                />
              </div>

              <div className="min-w-0">
                <div className="text-[15px] font-bold text-[#0F172A] leading-snug">
                  {HOME_CONTENT.advisorPrefix} {ADVISOR.name}
                </div>
                <div className="text-[13px] text-[#475569] leading-snug">
                  {ADVISOR.role}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onCallAdvisor}
              aria-label={`Call ${ADVISOR.name}`}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0F2A3F] to-[#0B6B5A] text-white flex items-center justify-center shrink-0 pressable cursor-pointer shadow-xs"
            >
              <Phone className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenHelp}
            className="w-full h-10 rounded-xl bg-[#EEF3FB] hover:bg-[#E2EAF6] text-[#0F2A3F] text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 pressable cursor-pointer transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-[#0B6B5A] stroke-[2.2]" />
            <span>Help &amp; support</span>
          </button>
        </div>
      </div>

      {/* 8. Social Proof / Reviews Card */}
      <div
        className="px-4 mt-4 fade-up"
        style={{ animationDelay: '420ms' }}
      >
        <button
          type="button"
          onClick={() => onNavigate('reviews')}
          aria-label={`${REVIEWS_SUMMARY.trustedText} — ${reviewsRatingText} rating. Open reviews`}
          className="w-full rounded-2xl bg-white/90 hover:bg-white px-4 py-3 shadow-[0_4px_16px_rgba(15,42,63,0.05)] flex items-center justify-between gap-3 text-left pressable cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-[68px] h-7 shrink-0" aria-hidden="true">
              <ResponsivePhoto
                asset={HOME_IMAGES.driver}
                lazy
                className="w-7 h-7 rounded-full ring-2 ring-white !absolute top-0 left-0"
                imgClassName="object-cover"
                style={{
                  objectPosition: '50% 35%',
                  transform: 'scale(1.45)',
                  transformOrigin: '50% 35%',
                }}
              />
              <ResponsivePhoto
                asset={HOME_IMAGES.driver}
                lazy
                className="w-7 h-7 rounded-full ring-2 ring-white !absolute top-0 left-5"
                imgClassName="object-cover"
                style={{
                  objectPosition: '48% 36%',
                  transform: 'scale(1.25)',
                  transformOrigin: '48% 36%',
                }}
              />
              <ResponsivePhoto
                asset={HOME_IMAGES.driver}
                lazy
                className="w-7 h-7 rounded-full ring-2 ring-white !absolute top-0 left-10"
                imgClassName="object-cover"
                style={{
                  objectPosition: '52% 33%',
                  transform: 'scale(1.6)',
                  transformOrigin: '52% 33%',
                }}
              />
            </div>
            <span className="text-[13px] font-medium text-[#334155] truncate">
              {REVIEWS_SUMMARY.trustedText}
            </span>
          </div>

          <div className="inline-flex items-center gap-1 text-[14px] font-bold text-[#0F172A] shrink-0">
            <Star className="w-4 h-4 text-[#0B6B5A] fill-[#14B8A6]" />
            <span>{reviewsRatingText}</span>
          </div>
        </button>
      </div>
    </div>
  );
};
