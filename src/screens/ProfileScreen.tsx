import React from 'react';
import {
  BadgeCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  RotateCcw,
} from 'lucide-react';
import {
  ADVISOR,
  HOME_IMAGES,
  type AppSettings,
  type CompanyInfo,
} from '../data/mock';
import { useScrollPersistence } from '../hooks';
import { Badge, Card, ResponsivePhoto } from '../components/ui';

interface ProfileScreenProps {
  company: CompanyInfo;
  truckCount: number;
  driverCount: number;
  settings: AppSettings;
  onBack: () => void;
  onCallAdvisor: () => void;
  onOpenHelp: () => void;
  onEditCompany: () => void;
  onToggleReduceMotion: (next: boolean) => void;
  onToggleShowTutorial: (next: boolean) => void;
  onRequestResetDemo: () => void;
  onSignOut: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  company,
  truckCount,
  driverCount,
  settings,
  onBack,
  onCallAdvisor,
  onOpenHelp,
  onEditCompany,
  onToggleReduceMotion,
  onToggleShowTutorial,
  onRequestResetDemo,
  onSignOut,
}) => {
  const { scrollRef, onScroll } = useScrollPersistence('profile');

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="flex-1 min-h-0 scroll-area screen-enter px-4 py-4 space-y-5"
    >
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="min-h-[44px] inline-flex items-center gap-1 text-[14px] font-semibold text-[#334155] hover:text-[#0F172A] -ml-1.5 px-1.5 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      {/* Dark Navy Carrier Card */}
      <div
        className="rounded-2xl p-4 text-white shadow-[0_6px_18px_rgba(9,23,38,0.14)]"
        style={{
          background: 'linear-gradient(145deg, #10283E 0%, #0F2A3F 100%)',
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-[#D9F2EA]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-[clamp(16px,4.5cqi,18px)] font-bold text-white truncate">
                  {company.name}
                </h1>
                <BadgeCheck className="w-4 h-4 text-[#D9F2EA] shrink-0" />
              </div>
              <p className="font-mono text-[14px] text-[#E2E8F0] mt-0.5 truncate">
                USDOT {company.usdot} • {company.mc}
              </p>
            </div>
          </div>
          <Badge tone="teal" dot className="shrink-0">
            {company.status}
          </Badge>
        </div>

        <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between gap-2 text-[14px] font-medium text-[#D9F2EA]">
          <span>
            {truckCount} truck{truckCount === 1 ? '' : 's'} • {driverCount} driver{driverCount === 1 ? '' : 's'}
          </span>
          <button
            type="button"
            onClick={onEditCompany}
            className="min-h-[36px] px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[13px] font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* Contact Details */}
      <Card padding="lg" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-[#0F2A3F]">
            Company Details
          </h2>
          <button
            type="button"
            onClick={onEditCompany}
            className="text-[13px] font-semibold text-[#0B6B5A] hover:underline cursor-pointer"
          >
            Edit details
          </button>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EEF3FB] text-[#0F2A3F] flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-[#475569]">Principal address</div>
            <div className="text-[14px] font-medium text-[#0F172A] mt-0.5 break-words">
              {company.address}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EEF3FB] text-[#0F2A3F] flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-[#475569]">Dispatch &amp; COI email</div>
            <div className="text-[14px] font-medium text-[#0F172A] mt-0.5 truncate">
              {company.email}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EEF3FB] text-[#0F2A3F] flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-[#475569]">Primary phone</div>
            <div className="font-mono text-[14px] font-medium text-[#0F172A] mt-0.5">
              {company.phone}
            </div>
          </div>
        </div>
      </Card>

      {/* Advisor Card */}
      <Card padding="lg" className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <ResponsivePhoto
            asset={HOME_IMAGES.advisor}
            className="w-11 h-11 rounded-full shrink-0"
            imgClassName="object-cover object-top"
          />
          <div className="min-w-0">
            <div className="text-[15px] font-bold text-[#0F172A] truncate">
              Your advisor: {ADVISOR.name}
            </div>
            <div className="text-[14px] text-[#475569] truncate">{ADVISOR.role}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onCallAdvisor}
          aria-label={`Call ${ADVISOR.name}`}
          className="w-11 h-11 rounded-xl bg-[#D9F2EA] text-[#0B6B5A] hover:bg-[#CBECE1] flex items-center justify-center shrink-0 cursor-pointer transition-colors"
        >
          <Phone className="w-4 h-4 stroke-[2.2]" />
        </button>
      </Card>

      {/* Settings Section */}
      <Card padding="lg" className="space-y-3.5">
        <h2 className="text-[14px] font-semibold text-[#0F2A3F]">Settings</h2>

        <div className="flex items-center justify-between gap-3 min-h-[44px]">
          <div className="min-w-0">
            <div className="text-[14px] font-medium text-[#0F172A]">Reduce motion</div>
            <div className="text-[12px] text-[#64748B]">Minimize transitions &amp; animations</div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.reduceMotion}
            aria-label="Reduce motion"
            onClick={() => onToggleReduceMotion(!settings.reduceMotion)}
            className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer shrink-0 ${
              settings.reduceMotion ? 'bg-[#0B6B5A]' : 'bg-[#CBD5E1]'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                settings.reduceMotion ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div
          className="pt-3 flex items-center justify-between gap-3 min-h-[44px]"
          style={{ borderTop: '0.5px solid #E1E5EC' }}
        >
          <div className="min-w-0">
            <div className="text-[14px] font-medium text-[#0F172A]">Show tutorial again</div>
            <div className="text-[12px] text-[#64748B]">Review portal tips &amp; quick guide</div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.showTutorial}
            aria-label="Show tutorial again"
            onClick={() => onToggleShowTutorial(!settings.showTutorial)}
            className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer shrink-0 ${
              settings.showTutorial ? 'bg-[#0B6B5A]' : 'bg-[#CBD5E1]'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                settings.showTutorial ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Help Link */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onOpenHelp}
          className="w-full min-h-[52px] bg-white rounded-2xl shadow-[0_1px_4px_rgba(15,23,42,0.05)] px-4 py-3 flex items-center justify-between gap-2 text-left hover:bg-[#EEF3FB]/50 cursor-pointer transition-colors"
        >
          <span className="inline-flex items-center gap-2.5 text-[14px] font-semibold text-[#0F172A]">
            <HelpCircle className="w-4 h-4 text-[#0B6B5A]" />
            Help &amp; support
          </span>
          <ChevronRight className="w-4 h-4 text-[#475569]" />
        </button>
      </div>

      {/* Sign Out Button */}
      <button
        type="button"
        onClick={onSignOut}
        className="w-full min-h-[48px] rounded-2xl bg-white shadow-[0_1px_4px_rgba(15,23,42,0.05)] text-[#0F2A3F] font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-[#EEF3FB]/60 transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>

      {/* Reset Demo Data Button */}
      <button
        type="button"
        onClick={onRequestResetDemo}
        className="w-full min-h-[48px] rounded-2xl bg-[#FEE2E2]/80 hover:bg-[#FEE2E2] text-[#B91C1C] font-semibold text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        Reset demo data
      </button>
    </div>
  );
};
