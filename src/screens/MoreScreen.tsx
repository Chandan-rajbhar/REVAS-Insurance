import React from 'react';
import {
  ArrowRight,
  Building2,
  ChevronRight,
  HelpCircle,
  LogOut,
  MessageSquare,
  Receipt,
  Shield,
  ShieldCheck,
  Star,
  Truck,
  User,
} from 'lucide-react';
import { COMPANY, HOME_IMAGES, POLICIES, type InProgressFiling } from '../data/mock';
import { ProgressBar, ResponsivePhoto } from '../components/ui';

const ReviewStarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Star className={className} fill="currentColor" strokeWidth={1.75} />
);

interface MoreScreenProps {
  truckCount: number;
  driverCount: number;
  advisorUnreadCount: number;
  inProgressFiling: InProgressFiling | null;
  onContinueQuote: () => void;
  onOpenFleet: () => void;
  onOpenPolicies: () => void;
  onOpenReviews: () => void;
  onOpenInvoices: () => void;
  onMessageSarah: () => void;
  onOpenHelp: () => void;
  onOpenProfile: () => void;
  onOpenLegalSecurity: () => void;
}

interface MoreMenuRow {
  id: string;
  title: string;
  subtitle: string;
  Icon: React.ComponentType<{ className?: string }>;
  iconBgClass: string;
  iconTextClass: string;
  badgeCount?: number;
  danger?: boolean;
  onClick: () => void;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({
  truckCount,
  driverCount,
  advisorUnreadCount,
  inProgressFiling,
  onContinueQuote,
  onOpenFleet,
  onOpenPolicies,
  onOpenReviews,
  onOpenInvoices,
  onMessageSarah,
  onOpenHelp,
  onOpenProfile,
  onOpenLegalSecurity,
}) => {
  const groups: { heading: string; rows: MoreMenuRow[] }[] = [
    {
      heading: 'Business',
      rows: [
        {
          id: 'fleet',
          title: 'Fleet',
          subtitle: `${truckCount} trucks · ${driverCount} drivers`,
          Icon: Truck,
          iconBgClass: 'bg-[#D9F2EA]',
          iconTextClass: 'text-[#0B6B5A]',
          onClick: onOpenFleet,
        },
        {
          id: 'policies',
          title: 'Policies',
          subtitle: `${POLICIES.length} active`,
          Icon: ShieldCheck,
          iconBgClass: 'bg-[#EEF3FB]',
          iconTextClass: 'text-[#0F2A3F]',
          onClick: onOpenPolicies,
        },
        {
          id: 'reviews',
          title: 'Reviews',
          subtitle: '4.9 rating · 2,400+ carriers',
          Icon: ReviewStarIcon,
          iconBgClass: 'bg-[#FAEEDA]',
          iconTextClass: 'text-[#854F0B]',
          onClick: onOpenReviews,
        },
        {
          id: 'invoices',
          title: 'Invoices & payments',
          subtitle: 'Receipts and fees',
          Icon: Receipt,
          iconBgClass: 'bg-[#EEF3FB]',
          iconTextClass: 'text-[#0F2A3F]',
          onClick: onOpenInvoices,
        },
      ],
    },
    {
      heading: 'Support',
      rows: [
        {
          id: 'message-sarah',
          title: 'Message Sarah',
          subtitle: 'Your advisor',
          Icon: MessageSquare,
          iconBgClass: 'bg-[#D9F2EA]',
          iconTextClass: 'text-[#0B6B5A]',
          badgeCount: advisorUnreadCount,
          onClick: onMessageSarah,
        },
        {
          id: 'help-center',
          title: 'Help center',
          subtitle: 'Call or get support',
          Icon: HelpCircle,
          iconBgClass: 'bg-[#EEF3FB]',
          iconTextClass: 'text-[#0F2A3F]',
          onClick: onOpenHelp,
        },
      ],
    },
    {
      heading: 'Account',
      rows: [
        {
          id: 'profile',
          title: 'Profile & company details',
          subtitle: 'Address, email & phone',
          Icon: User,
          iconBgClass: 'bg-[#EEF3FB]',
          iconTextClass: 'text-[#0F2A3F]',
          onClick: onOpenProfile,
        },
        {
          id: 'legal',
          title: 'Legal & security',
          subtitle: 'Encryption & disclosures',
          Icon: Shield,
          iconBgClass: 'bg-[#EEF3FB]',
          iconTextClass: 'text-[#0F2A3F]',
          onClick: onOpenLegalSecurity,
        },
        {
          id: 'sign-out',
          title: 'Sign out',
          subtitle: 'Current session',
          Icon: LogOut,
          iconBgClass: 'bg-[#FDE9E9]',
          iconTextClass: 'text-[#B91C1C]',
          danger: true,
          onClick: () => {},
        },
      ],
    },
  ];

  return (
    <div className="flex-1 min-h-0 scroll-area screen-enter bg-[#F6F8FC] px-4 pt-4 pb-6">
      <div className="space-y-3">
        <h1 className="text-[20px] font-medium text-[#0F2A3F] leading-[1.2] tracking-[-0.01em]">
          More
        </h1>

        <div className="rounded-[16px] bg-[#0F2A3F] p-4 text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-white/10 text-[#99F6E4] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[16px] font-medium text-white leading-[1.3] truncate">
              {COMPANY.name}
            </div>
            <div className="text-[13px] text-[#BFDBFE] leading-[1.35] truncate mt-0.5">
              USDOT {COMPANY.usdot} · {COMPANY.mc}
            </div>
          </div>
        </div>
      </div>

      {inProgressFiling && (
        <section className="mt-[14px]">
          <h2 className="text-[13px] font-medium text-[#5F5E5A] mb-[8px]">
            Quote in progress
          </h2>
          <div
            className="bg-white rounded-[16px] p-[14px]"
            style={{ border: '0.5px solid #E1E5EC' }}
          >
            <div className="flex items-start gap-3">
              <ResponsivePhoto
                asset={HOME_IMAGES.fleet}
                className="w-16 h-16 rounded-[12px] shrink-0"
                imgClassName="object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[15px] font-medium text-[#0F2A3F] leading-[1.3] truncate">
                    {inProgressFiling.title}
                  </h3>
                  <span className="text-[13px] font-medium text-[#0B6B5A] shrink-0">
                    {inProgressFiling.percent}%
                  </span>
                </div>
                <p className="text-[13px] text-[#64748B] leading-[1.35] mt-0.5 truncate">
                  {inProgressFiling.stepText}
                </p>
                <ProgressBar
                  percent={inProgressFiling.percent}
                  height="sm"
                  animateOnMount
                  className="mt-2"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onContinueQuote}
              className="mt-3 w-full h-[44px] rounded-[12px] bg-[#0F2A3F] hover:bg-[#163854] text-white text-[14px] font-medium inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {groups.map((group) => (
        <section key={group.heading} className="mt-5">
          <h2 className="text-[13px] font-medium text-[#5F5E5A] mb-2">
            {group.heading}
          </h2>
          <div
            className="bg-white rounded-[16px] overflow-hidden"
            style={{ border: '0.5px solid #E1E5EC' }}
          >
            {group.rows.map((row, idx) => {
              const Icon = row.Icon;
              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={row.onClick}
                  style={idx > 0 ? { borderTop: '0.5px solid #E1E5EC' } : undefined}
                  className="min-h-[56px] w-full px-3.5 py-2.5 flex items-center gap-3 text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <div
                    className={`w-9 h-9 rounded-[10px] ${row.iconBgClass} ${row.iconTextClass} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-[18px] h-[18px] stroke-[2]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-[14px] font-medium leading-[1.3] truncate ${
                        row.danger ? 'text-[#B91C1C]' : 'text-[#0F2A3F]'
                      }`}
                    >
                      {row.title}
                    </div>
                    <div className="text-[13px] text-[#64748B] leading-[1.35] truncate mt-0.5">
                      {row.subtitle}
                    </div>
                  </div>

                  {typeof row.badgeCount === 'number' && row.badgeCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#0B6B5A] text-white text-[12px] font-medium inline-flex items-center justify-center leading-none shrink-0">
                      {row.badgeCount}
                    </span>
                  )}

                  <ChevronRight className="w-4 h-4 text-[#94A3B8] shrink-0" />
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

