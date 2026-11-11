import React from 'react';
import { BadgeCheck, ClipboardList, Folder, Home, LayoutGrid } from 'lucide-react';
import type { TabId } from '../data/mock';

interface BottomNavProps {
  activeTab: TabId | null;
  hasMoreBadge?: boolean;
  onSelectTab: (tab: TabId) => void;
}

const NAV_ITEMS: {
  id: TabId;
  label: string;
  compactLabel?: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'services', label: 'Services', Icon: BadgeCheck },
  { id: 'documents', label: 'Documents', compactLabel: 'Docs', Icon: Folder },
  { id: 'requests', label: 'Requests', Icon: ClipboardList },
  { id: 'more', label: 'More', Icon: LayoutGrid },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  hasMoreBadge = false,
  onSelectTab,
}) => {
  return (
    <nav
      aria-label="Primary navigation"
      className="shrink-0 w-full bg-white shadow-[0_-1px_0_#E5E9F0] px-1 pt-2 safe-bottom-padded compact-nav flex items-center justify-between select-none"
    >
      {NAV_ITEMS.map(({ id, label, compactLabel, Icon }) => {
        const isActive = activeTab === id;
        const showDot = id === 'more' && hasMoreBadge;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelectTab(id)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={label}
            className="flex-1 min-w-0 min-h-[44px] flex flex-col items-center justify-center gap-1 py-0.5 cursor-pointer group"
          >
            <div
              className={`relative w-[52px] h-[30px] rounded-full flex items-center justify-center transition-colors ${
                isActive ? 'bg-[#D9F2EA]' : 'bg-transparent group-hover:bg-[#EEF3FB]'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive
                    ? 'text-[#0B6B5A] stroke-[2.2]'
                    : 'text-[#5F5E5A] stroke-[1.9]'
                }`}
              />
              {showDot && (
                <span
                  aria-label="Quote in progress"
                  className={`w-2 h-2 rounded-full bg-[#0B6B5A] absolute top-[3px] right-[12px] ring-2 ${
                    isActive ? 'ring-[#D9F2EA]' : 'ring-white'
                  }`}
                />
              )}
            </div>
            <span
              className={`text-[12px] leading-none whitespace-nowrap max-w-full px-0.5 ${
                isActive ? 'font-medium text-[#0B6B5A]' : 'font-normal text-[#5F5E5A]'
              }`}
            >
              {compactLabel ? (
                <>
                  <span className="hidden @[360px]:inline">{label}</span>
                  <span className="@[360px]:hidden">{compactLabel}</span>
                </>
              ) : (
                label
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
