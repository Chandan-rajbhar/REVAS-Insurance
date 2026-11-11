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
  Phone,
} from 'lucide-react';
import { ADVISOR, COMPANY, HOME_IMAGES } from '../data/mock';
import { Badge, Card, ResponsivePhoto } from '../components/ui';

interface ProfileScreenProps {
  onBack: () => void;
  onCallAdvisor: () => void;
  onOpenHelp: () => void;
  onSignOut: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onCallAdvisor,
  onOpenHelp,
  onSignOut,
}) => {
  return (
    <div className="flex-1 min-h-0 scroll-area screen-enter px-4 py-4 space-y-5">
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
                  {COMPANY.name}
                </h1>
                <BadgeCheck className="w-4 h-4 text-[#D9F2EA] shrink-0" />
              </div>
              <p className="font-mono text-[14px] text-[#E2E8F0] mt-0.5 truncate">
                USDOT {COMPANY.usdot} • {COMPANY.mc}
              </p>
            </div>
          </div>
          <Badge tone="teal" dot className="shrink-0">
            {COMPANY.status}
          </Badge>
        </div>

        <div className="mt-3 pt-3 border-t border-white/15 text-[14px] font-medium text-[#D9F2EA]">
          {COMPANY.powerUnits} trucks • {COMPANY.driversCount} drivers
        </div>
      </div>

      {/* Contact Details */}
      <Card padding="lg" className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EEF3FB] text-[#0F2A3F] flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-[#475569]">Principal address</div>
            <div className="text-[14px] font-medium text-[#0F172A] mt-0.5 break-words">
              {COMPANY.address}
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
              {COMPANY.email}
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
              {COMPANY.phone}
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
        className="w-full min-h-[48px] rounded-2xl bg-white shadow-[0_1px_4px_rgba(15,23,42,0.05)] text-[#B91C1C] font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-[#FEE2E2]/40 transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
};
