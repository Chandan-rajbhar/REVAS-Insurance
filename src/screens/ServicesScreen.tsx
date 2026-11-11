import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  ClipboardCheck,
  FileCheck2,
  Fuel,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { SERVICES, type ServiceItem } from '../data/mock';
import { Button, EmptyState, SectionHeader } from '../components/ui';

type ServiceFilter = 'All' | ServiceItem['filterGroup'];

const FILTER_CHIPS: ServiceFilter[] = ['All', 'Filings', 'Permits', 'Safety'];

const SECTIONS: ServiceItem['section'][] = [
  'Registrations & Authority',
  'Fuel Taxes & State Permits',
  'Safety & Driver Compliance',
];

const SERVICE_ICON_STYLES: Record<
  string,
  {
    Icon: React.ComponentType<{ className?: string }>;
    bgClass: string;
    textClass: string;
  }
> = {
  'srv-boc3': {
    Icon: FileCheck2,
    bgClass: 'bg-[#D9F2EA]',
    textClass: 'text-[#0B6B5A]',
  },
  'srv-mcs150': {
    Icon: RefreshCw,
    bgClass: 'bg-[#EEF3FB]',
    textClass: 'text-[#0F2A3F]',
  },
  'srv-ifta': {
    Icon: Fuel,
    bgClass: 'bg-[#EEF3FB]',
    textClass: 'text-[#0F2A3F]',
  },
  'srv-permits': {
    Icon: MapPin,
    bgClass: 'bg-[#D9F2EA]',
    textClass: 'text-[#0B6B5A]',
  },
  'srv-clearinghouse': {
    Icon: ShieldCheck,
    bgClass: 'bg-[#D9F2EA]',
    textClass: 'text-[#0B6B5A]',
  },
  'srv-audit': {
    Icon: ClipboardCheck,
    bgClass: 'bg-[#EEF3FB]',
    textClass: 'text-[#0F2A3F]',
  },
};

const DEFAULT_ICON_STYLE = {
  Icon: FileCheck2,
  bgClass: 'bg-[#EEF3FB]',
  textClass: 'text-[#0F2A3F]',
};

interface ServicesScreenProps {
  onInspectService: (service: ServiceItem) => void;
  onSelectService: (service: ServiceItem) => void;
  onFileUcrNow: () => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({
  onInspectService,
  onSelectService,
  onFileUcrNow,
}) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<ServiceFilter>('All');

  const filteredServices = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SERVICES.filter((item) => {
      const matchesChip = activeFilter === 'All' || item.filterGroup === activeFilter;
      if (!matchesChip) return false;
      if (!q) return true;
      return (
        (item.shortTitle ?? '').toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q)
      );
    });
  }, [search, activeFilter]);

  return (
    <div className="flex-1 min-h-0 scroll-area screen-enter py-4 overflow-x-hidden">
      {/* Search Bar */}
      <div className="px-4">
        <div className="w-full min-h-[46px] bg-white rounded-2xl px-3.5 flex items-center gap-2.5 shadow-[0_1px_4px_rgba(15,23,42,0.05)] focus-within:ring-2 focus-within:ring-[#0B6B5A]">
          <Search className="w-4 h-4 text-[#475569] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search filings, permits, safety..."
            aria-label="Search DOT services"
            className="flex-1 min-w-0 bg-transparent text-[16px] text-[#0F172A] placeholder:text-[#64748B] outline-none py-2"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="min-h-[44px] px-2 text-[14px] font-semibold text-[#475569] hover:text-[#0F172A] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="mt-5 w-full px-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {FILTER_CHIPS.map((chip) => {
          const active = activeFilter === chip;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveFilter(chip)}
              aria-pressed={active}
              className={`shrink-0 min-h-[44px] px-4 rounded-full text-[14px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-[#0F2A3F] text-white'
                  : 'bg-white text-[#334155] shadow-[0_1px_3px_rgba(15,23,42,0.05)] hover:bg-[#EEF3FB]'
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Shortened UCR Banner */}
      <div className="mt-5 px-4">
        <div
          className="rounded-2xl p-4 text-white shadow-[0_6px_18px_rgba(9,23,38,0.14)] flex flex-col gap-3"
          style={{
            background: 'linear-gradient(145deg, #10283E 0%, #0F2A3F 100%)',
          }}
        >
          <h2 className="text-[16px] font-bold text-white leading-snug">
            2025 UCR registration due soon
          </h2>
          <div>
            <Button
              variant="teal"
              size="md"
              onClick={onFileUcrNow}
              className="w-full sm:w-auto"
            >
              File now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grouped Services or Empty State */}
      {filteredServices.length === 0 ? (
        <div className="mt-[18px] px-4">
          <EmptyState
            icon={<Search className="w-6 h-6" />}
            title="No matching services"
            description="Try a different search term or reset your filter."
            actionLabel="Show all services"
            onAction={() => {
              setSearch('');
              setActiveFilter('All');
            }}
          />
        </div>
      ) : (
        <div className="mt-[18px] px-4 space-y-6">
          {SECTIONS.map((sectionName) => {
            const items = filteredServices.filter((s) => s.section === sectionName);
            if (items.length === 0) return null;

            return (
              <section key={sectionName} className="space-y-3">
                <SectionHeader title={sectionName} />

                <div
                  className="grid gap-[10px]"
                  style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}
                >
                  {items.map((item) => {
                    const iconStyle = SERVICE_ICON_STYLES[item.id] ?? DEFAULT_ICON_STYLE;
                    const Icon = iconStyle.Icon;
                    const displayTitle = item.shortTitle ?? item.title;
                    const displayPrice = item.shortPrice ?? item.price;

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-[16px] overflow-hidden flex flex-col h-full min-w-0"
                        style={{ border: '0.5px solid #E1E5EC' }}
                      >
                        <button
                          type="button"
                          onClick={() => onInspectService(item)}
                          className="w-full flex-1 px-[12px] pt-[12px] pb-[10px] flex flex-col items-start text-left cursor-pointer hover:bg-[#F8FAFC] transition-colors min-w-0"
                        >
                          <div
                            className={`w-9 h-9 rounded-[10px] ${iconStyle.bgClass} ${iconStyle.textClass} flex items-center justify-center shrink-0`}
                          >
                            <Icon className="w-[18px] h-[18px] stroke-[2]" />
                          </div>

                          <h3 className="mt-2.5 w-full min-h-[36px] text-[14px] font-medium text-[#0F2A3F] leading-[1.3] line-clamp-2 break-words">
                            {displayTitle}
                          </h3>

                          <p className="mt-1 w-full text-[13px] text-[#5F5E5A] leading-[1.35] whitespace-nowrap truncate">
                            {displayPrice}
                          </p>
                        </button>

                        <div className="px-[12px] pb-[12px] pt-[2px]">
                          <button
                            type="button"
                            onClick={() => onSelectService(item)}
                            className="w-full h-[40px] rounded-[10px] bg-gradient-to-r from-[#0F2A3F] via-[#0E434D] to-[#0B6B5A] hover:brightness-110 text-white text-[14px] font-medium inline-flex items-center justify-center pressable cursor-pointer transition-all"
                          >
                            {item.ctaLabel}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
