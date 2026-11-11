import React from 'react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Container,
  Package,
  Plus,
  Truck,
} from 'lucide-react';
import {
  CARGO_CLASSIFICATIONS,
  type CoverageOption,
  TRAILER_TYPES,
  type VehicleItem,
} from '../data/mock';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  InFrameSelect,
  ProgressBar,
  SectionHeader,
} from '../components/ui';

interface IssueCertificateScreenProps {
  vehicles: VehicleItem[];
  trailerType: string;
  cargoClass: string;
  maxCargoValue: string;
  coverages: CoverageOption[];
  onBackHome: () => void;
  onAddVehicle: () => void;
  onEditVehicle: (vehicle: VehicleItem) => void;
  onOpenSelectPicker: (
    title: string,
    options: string[],
    current: string,
    onSelect: (value: string) => void,
  ) => void;
  onChangeTrailerType: (val: string) => void;
  onChangeCargoClass: (val: string) => void;
  onChangeMaxCargoValue: (val: string) => void;
  onToggleCoverage: (id: string) => void;
  onSaveLater: () => void;
  onContinueDrivers: () => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const IssueCertificateScreen: React.FC<IssueCertificateScreenProps> = ({
  vehicles,
  trailerType,
  cargoClass,
  maxCargoValue,
  coverages,
  onBackHome,
  onAddVehicle,
  onEditVehicle,
  onOpenSelectPicker,
  onChangeTrailerType,
  onChangeCargoClass,
  onChangeMaxCargoValue,
  onToggleCoverage,
  onSaveLater,
  onContinueDrivers,
  scrollContainerRef,
}) => {
  const includedCoverages = coverages.filter((c) => c.group === 'included');
  const addonCoverages = coverages.filter((c) => c.group === 'addon');

  const handleCargoInput = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, '');
    if (!digits) {
      onChangeMaxCargoValue('');
      return;
    }
    onChangeMaxCargoValue(Number(digits).toLocaleString('en-US'));
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col bg-[#F6F8FC]">
      <div ref={scrollContainerRef} className="flex-1 min-h-0 scroll-area screen-enter">
        {/* Progress Header */}
        <div className="bg-white px-4 pt-2 pb-4 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onBackHome}
              className="min-h-[44px] inline-flex items-center gap-1 text-[14px] font-semibold text-[#334155] hover:text-[#0F172A] -ml-1.5 px-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </button>
            <Badge tone="neutral">Step 3 of 6</Badge>
          </div>

          <h1 className="text-[20px] font-bold text-[#0F172A] tracking-tight mt-1">
            Vehicles &amp; Equipment
          </h1>
          <ProgressBar percent={50} label="Quote step 3 of 6" className="mt-3" />
        </div>

        <div className="px-4 py-5 space-y-6">
          {/* 1. Vehicles */}
          <section className="space-y-3">
            <SectionHeader title="Vehicles" rightText={`${vehicles.length} scheduled`} />

            {vehicles.length === 0 ? (
              <EmptyState
                icon={<Truck className="w-6 h-6" />}
                title="No vehicles added"
                description="Add at least one truck or tractor to continue your quote."
                actionLabel="Add Vehicle"
                onAction={onAddVehicle}
              />
            ) : (
              <div className="space-y-3">
                {vehicles.map((v) => (
                  <Card key={v.id} padding="lg" className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-[16px] font-bold text-[#0F172A] truncate">{v.name}</h3>
                      <p className="text-[14px] text-[#475569] mt-0.5 truncate">
                        {v.cab} • {v.radius} • {v.statedValue}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onEditVehicle(v)}
                      className="min-h-[44px] px-4 rounded-xl bg-[#EEF3FB] hover:bg-[#E2EAF6] text-[14px] font-semibold text-[#0F172A] shrink-0 cursor-pointer transition-colors"
                    >
                      Edit
                    </button>
                  </Card>
                ))}

                <Button
                  variant="outline-light"
                  fullWidth
                  size="lg"
                  onClick={onAddVehicle}
                >
                  <Plus className="w-4 h-4" />
                  Add Vehicle
                </Button>
              </div>
            )}
          </section>

          {/* 2. Trailer & Cargo */}
          <section className="space-y-3">
            <SectionHeader title="Trailer & cargo" />

            <Card padding="lg" className="space-y-4">
              <InFrameSelect
                label="Trailer type"
                required
                value={trailerType}
                options={TRAILER_TYPES}
                icon={<Container className="w-4 h-4" />}
                onSelect={onChangeTrailerType}
                onOpenPicker={onOpenSelectPicker}
              />

              <InFrameSelect
                label="Cargo type"
                required
                value={cargoClass}
                options={CARGO_CLASSIFICATIONS}
                icon={<Package className="w-4 h-4" />}
                onSelect={onChangeCargoClass}
                onOpenPicker={onOpenSelectPicker}
              />

              <div>
                <label
                  htmlFor="max-cargo-value"
                  className="block text-[14px] font-semibold text-[#0F172A] mb-1.5"
                >
                  Maximum cargo value
                </label>
                <div className="flex items-center bg-[#EEF3FB] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0B6B5A] rounded-xl px-3.5 min-h-[44px] transition-all">
                  <span className="font-mono text-[15px] font-bold text-[#334155] mr-1.5">$</span>
                  <input
                    id="max-cargo-value"
                    type="text"
                    inputMode="numeric"
                    value={maxCargoValue}
                    onChange={(e) => handleCargoInput(e.target.value)}
                    className="flex-1 min-w-0 bg-transparent font-mono text-[16px] font-bold text-[#0F172A] outline-none py-2"
                  />
                </div>
                <p className="text-[14px] text-[#475569] mt-1.5">Average value per load</p>
              </div>
            </Card>
          </section>

          {/* 3. Coverage Options */}
          <section className="space-y-4">
            <div className="space-y-3">
              <SectionHeader title="Included" />
              <div className="space-y-2.5">
                {includedCoverages.map((cov) => (
                  <Card key={cov.id} padding="lg" className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-[#0B6B5A] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[2.75]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[15px] font-bold text-[#0F172A]">{cov.title}</div>
                      <p className="text-[14px] text-[#475569] mt-0.5 leading-snug">
                        {cov.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <SectionHeader title="Add-ons" />
              <div className="space-y-2.5">
                {addonCoverages.map((cov) => (
                  <button
                    key={cov.id}
                    type="button"
                    aria-pressed={cov.checked}
                    onClick={() => onToggleCoverage(cov.id)}
                    className={`w-full min-h-[60px] text-left rounded-2xl p-4 flex items-start gap-3 transition-all cursor-pointer shadow-[0_1px_4px_rgba(15,23,42,0.05)] ${
                      cov.checked ? 'bg-[#D9F2EA]/50 ring-2 ring-[#0B6B5A]' : 'bg-white hover:bg-[#EEF3FB]/50'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        cov.checked
                          ? 'bg-[#0B6B5A] text-white'
                          : 'bg-[#EEF3FB] border border-[#CBD5E1]'
                      }`}
                    >
                      {cov.checked && <Check className="w-4 h-4 stroke-[2.75]" />}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[15px] font-bold text-[#0F172A]">{cov.title}</div>
                      <p className="text-[14px] text-[#475569] mt-0.5 leading-snug">
                        {cov.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="shrink-0 bg-white shadow-[0_-2px_10px_rgba(15,23,42,0.06)] px-4 pt-3 safe-bottom-padded space-y-2">
        <div className="btn-row-responsive flex items-center gap-2.5">
          <button
            type="button"
            onClick={onSaveLater}
            className="min-h-[44px] px-3 rounded-xl text-[14px] font-semibold text-[#334155] hover:bg-[#EEF3FB] cursor-pointer shrink-0 transition-colors"
          >
            Save for later
          </button>
          <Button
            variant="primary"
            size="lg"
            onClick={onContinueDrivers}
            className="flex-1"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[12px] text-[#475569] text-center leading-snug">
          Reviewed by an advisor within 2 business hours before binding.
        </p>
      </div>
    </div>
  );
};
