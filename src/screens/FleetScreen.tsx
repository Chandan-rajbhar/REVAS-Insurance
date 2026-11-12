import React from 'react';
import { ArrowLeft, Plus, Truck, Users } from 'lucide-react';
import { type FleetDriver, type FleetTruck, type UiState } from '../data/mock';
import { useScrollPersistence } from '../hooks';
import { formatExpiryCountdown, formatShortDate, getDaysUntil } from '../lib/dates';
import { EmptyState } from '../components/ui';

type FleetSegment = UiState['fleetSegment'];

interface FleetScreenProps {
  companyName: string;
  trucks: FleetTruck[];
  drivers: FleetDriver[];
  segment: FleetSegment;
  onSegmentChange: (segment: FleetSegment) => void;
  onBack: () => void;
  onSelectTruck: (truck: FleetTruck) => void;
  onSelectDriver: (driver: FleetDriver) => void;
  onAddTruck: () => void;
  onAddDriver: () => void;
}

const DRIVER_TONE_CLASSES: Record<
  FleetDriver['statusTone'],
  { circle: string; pill: string }
> = {
  green: {
    circle: 'bg-[#D9F2EA] text-[#0B6B5A]',
    pill: 'bg-[#D9F2EA] text-[#0B6B5A]',
  },
  red: {
    circle: 'bg-[#FDE9E9] text-[#B91C1C]',
    pill: 'bg-[#FDE9E9] text-[#B91C1C]',
  },
  amber: {
    circle: 'bg-[#FEF3C7] text-[#B45309]',
    pill: 'bg-[#FEF3C7] text-[#B45309]',
  },
};

export const FleetScreen: React.FC<FleetScreenProps> = ({
  companyName,
  trucks,
  drivers,
  segment,
  onSegmentChange,
  onBack,
  onSelectTruck,
  onSelectDriver,
  onAddTruck,
  onAddDriver,
}) => {
  const { scrollRef, onScroll } = useScrollPersistence('fleet');

  const getDriverStatus = (driver: FleetDriver): {
    label: string;
    tone: FleetDriver['statusTone'];
  } => {
    const days = getDaysUntil(driver.medicalExpiryIso);
    if (days !== null && days <= 30) {
      return {
        label: formatExpiryCountdown(driver.medicalExpiryIso),
        tone: days <= 14 ? 'red' : 'amber',
      };
    }
    return {
      label: 'Active',
      tone: 'green',
    };
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full min-w-0 bg-[#F6F8FC]">
      {/* Header */}
      <header className="safe-top bg-white shrink-0">
        <div className="pl-[6px] pr-4 pt-[10px] pb-[8px] flex items-center gap-1.5">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to More"
            className="w-11 h-11 rounded-full flex items-center justify-center text-[#0F2A3F] hover:bg-[#F3F5FA] pressable cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          <div className="min-w-0">
            <h1 className="text-[20px] font-medium text-[#0F2A3F] leading-[1.2] tracking-[-0.01em] truncate">
              Fleet
            </h1>
            <p className="text-[14px] text-[#64748B] leading-[1.3] truncate mt-[2px]">
              {companyName}
            </p>
          </div>
        </div>

        {/* Segmented Control */}
        <div className="px-4 pt-1 pb-3">
          <div
            role="tablist"
            aria-label="Fleet categories"
            className="h-[44px] rounded-[12px] p-[3px] bg-[#EEF3FB] flex items-stretch"
          >
            <button
              type="button"
              role="tab"
              aria-selected={segment === 'trucks'}
              onClick={() => onSegmentChange('trucks')}
              className={`flex-1 rounded-[9px] text-[14px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                segment === 'trucks'
                  ? 'bg-[#0F2A3F] text-white'
                  : 'text-[#5F5E5A] hover:text-[#0F2A3F]'
              }`}
            >
              Trucks · {trucks.length}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={segment === 'drivers'}
              onClick={() => onSegmentChange('drivers')}
              className={`flex-1 rounded-[9px] text-[14px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                segment === 'drivers'
                  ? 'bg-[#0F2A3F] text-white'
                  : 'text-[#5F5E5A] hover:text-[#0F2A3F]'
              }`}
            >
              Drivers · {drivers.length}
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable List */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 min-h-0 scroll-area px-4 pt-3 pb-6"
      >
        {segment === 'trucks' ? (
          trucks.length === 0 ? (
            <EmptyState
              icon={<Truck className="w-6 h-6 text-[#0B6B5A]" />}
              title="No trucks listed"
              description="Add your commercial trucks or tractors to manage fleet coverage."
              actionLabel="Add truck"
              onAction={onAddTruck}
            />
          ) : (
            <div
              className="bg-white rounded-[16px] overflow-hidden"
              style={{ border: '0.5px solid #E1E5EC' }}
            >
              {trucks.map((truck, idx) => (
                <button
                  key={truck.id}
                  type="button"
                  onClick={() => onSelectTruck(truck)}
                  style={idx > 0 ? { borderTop: '0.5px solid #E1E5EC' } : undefined}
                  className="min-h-[60px] w-full px-3 py-3 flex items-center gap-2.5 text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-[10px] bg-[#EEF3FB] text-[#0F2A3F] flex items-center justify-center shrink-0">
                    <Truck className="w-[18px] h-[18px] stroke-[2]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-medium text-[#0F2A3F] leading-[1.3] truncate">
                      {truck.name}
                    </div>
                    <div className="text-[13px] text-[#64748B] leading-[1.35] truncate mt-0.5">
                      {truck.cab} · {truck.statedValue}
                    </div>
                  </div>

                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap ${
                      truck.status === 'Insured'
                        ? 'bg-[#D9F2EA] text-[#0B6B5A]'
                        : 'bg-[#FEF3C7] text-[#B45309]'
                    }`}
                  >
                    {truck.status}
                  </span>
                </button>
              ))}
            </div>
          )
        ) : drivers.length === 0 ? (
          <EmptyState
            icon={<Users className="w-6 h-6 text-[#0B6B5A]" />}
            title="No drivers listed"
            description="Add your CDL drivers to track medical cards and fleet qualification."
            actionLabel="Add driver"
            onAction={onAddDriver}
          />
        ) : (
          <div
            className="bg-white rounded-[16px] overflow-hidden"
            style={{ border: '0.5px solid #E1E5EC' }}
          >
            {drivers.map((driver, idx) => {
              const status = getDriverStatus(driver);
              const tone = DRIVER_TONE_CLASSES[status.tone];
              return (
                <button
                  key={driver.id}
                  type="button"
                  onClick={() => onSelectDriver(driver)}
                  style={idx > 0 ? { borderTop: '0.5px solid #E1E5EC' } : undefined}
                  className="min-h-[60px] w-full px-3 py-3 flex items-center gap-2.5 text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <div
                    className={`w-9 h-9 rounded-full ${tone.circle} flex items-center justify-center shrink-0 text-[13px] font-semibold`}
                  >
                    {driver.initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-medium text-[#0F2A3F] leading-[1.3] truncate">
                      {driver.name}
                    </div>
                    <div className="text-[13px] text-[#64748B] leading-[1.35] truncate mt-0.5">
                      CDL · Medical card valid until {formatShortDate(driver.medicalExpiryIso)}
                    </div>
                  </div>

                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap ${tone.pill}`}
                  >
                    {status.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={segment === 'trucks' ? onAddTruck : onAddDriver}
          className="mt-3 h-[44px] w-full rounded-[14px] border border-dashed border-[#0B6B5A] text-[#0B6B5A] hover:bg-[#D9F2EA]/40 text-[14px] font-medium inline-flex items-center justify-center gap-1.5 pressable cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
          <span>{segment === 'trucks' ? 'Add truck' : 'Add driver'}</span>
        </button>
      </div>
    </div>
  );
};

