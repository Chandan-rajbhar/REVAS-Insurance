import React from 'react';
import { ArrowLeft, Bell, Truck, User } from 'lucide-react';

interface TopHeaderProps {
  hasUnreadNotifications: boolean;
  isProfileActive?: boolean;
  showBottomBorder?: boolean;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onLogoClick: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  hasUnreadNotifications,
  isProfileActive = false,
  showBottomBorder = true,
  onOpenNotifications,
  onOpenProfile,
  onLogoClick,
}) => {
  return (
    <header
      className="shrink-0 bg-white safe-top px-4 select-none text-[#0F172A] relative z-20"
      style={showBottomBorder ? { borderBottom: '0.5px solid #E1E5EC' } : undefined}
    >
      <div className="compact-header-inner h-[56px] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onLogoClick}
          className="min-h-[40px] flex items-center gap-2.5 text-left cursor-pointer group min-w-0"
        >
          <div className="w-9 h-9 rounded-[9px] bg-[#0F2A3F] text-white flex items-center justify-center group-active:scale-95 transition-transform shrink-0">
            <Truck className="w-[18px] h-[18px] stroke-[2]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-medium tracking-tight leading-[1.15] text-[#0F2A3F] truncate">
              REVAS
            </span>
            <span className="text-[11px] font-medium tracking-[0.04em] leading-[1.15] text-[#64748B] truncate">
              INSURANCE &amp; DOT
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label="Open notifications"
            className="relative w-10 h-10 rounded-full text-[#0F2A3F] hover:bg-[#EEF3FB] flex items-center justify-center cursor-pointer transition-colors"
          >
            <Bell className="w-5 h-5 stroke-[1.9]" />
            {hasUnreadNotifications && (
              <span
                aria-hidden="true"
                className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#B91C1C] ring-2 ring-white"
              />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            aria-label="Open carrier profile"
            aria-pressed={isProfileActive}
            className={`w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer transition-colors ${
              isProfileActive
                ? 'bg-[#0B6B5A] text-white ring-2 ring-[#D9F2EA]'
                : 'bg-[#0F2A3F] text-white hover:bg-[#1E3A5F]'
            }`}
          >
            <User className="w-[17px] h-[17px] stroke-[2.1]" />
          </button>
        </div>
      </div>
    </header>
  );
};

interface SubScreenHeaderProps {
  title: string;
  onBack: () => void;
  onOpenProfile: () => void;
}

export const SubScreenHeader: React.FC<SubScreenHeaderProps> = ({
  title,
  onBack,
  onOpenProfile,
}) => {
  return (
    <header
      className="shrink-0 bg-white safe-top px-3 select-none relative z-20"
      style={{ borderBottom: '0.5px solid #E1E5EC' }}
    >
      <div className="compact-header-inner h-[56px] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 min-w-0">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#0F172A] hover:bg-[#EEF3FB] cursor-pointer transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.1]" />
          </button>
          <h1 className="text-[17px] font-bold text-[#0F172A] tracking-tight truncate">
            {title}
          </h1>
        </div>

        <button
          type="button"
          onClick={onOpenProfile}
          aria-label="Open carrier profile"
          className="w-[38px] h-[38px] rounded-full bg-[#0F2A3F] text-white hover:bg-[#1E3A5F] flex items-center justify-center cursor-pointer transition-colors shrink-0"
        >
          <User className="w-[17px] h-[17px] stroke-[2.1]" />
        </button>
      </div>
    </header>
  );
};
