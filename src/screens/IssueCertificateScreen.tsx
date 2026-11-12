import React, { useState } from 'react';
import {
  AlertCircle,
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
  TRAILER_TYPES,
  type CompanyInfo,
  type FleetDriver,
  type QuoteDraft,
  type QuoteStep,
  type VehicleItem,
} from '../data/mock';
import { useScrollPersistence } from '../hooks';
import { formatExpiryCountdown, formatShortDate } from '../lib/dates';
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
  company: CompanyInfo;
  quote: QuoteDraft;
  drivers: FleetDriver[];
  onBackHome: () => void;
  onStepChange: (step: QuoteStep) => void;
  onUpdateQuote: (patch: Partial<QuoteDraft>) => void;
  onAddVehicle: () => void;
  onEditVehicle: (vehicle: VehicleItem) => void;
  onOpenSelectPicker: (
    title: string,
    options: string[],
    current: string,
    onSelect: (value: string) => void,
  ) => void;
  onToggleCoverage: (id: string) => void;
  onSaveLater: () => void;
  onSubmitQuote: () => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

const STEP_META: Record<QuoteStep, { title: string; nextLabel: string }> = {
  1: { title: 'Carrier & Policy Basics', nextLabel: 'Continue to Operations' },
  2: { title: 'Authority & Operations', nextLabel: 'Continue to Vehicles' },
  3: { title: 'Vehicles & Equipment', nextLabel: 'Continue to Drivers' },
  4: { title: 'Driver Schedule', nextLabel: 'Continue to Loss Runs' },
  5: { title: 'Loss Runs & Filings', nextLabel: 'Review Quote' },
  6: { title: 'Review & Submit Quote', nextLabel: 'Submit Quote Request' },
};

const FILING_OPTIONS = [
  'BMC-91X Federal Filing',
  'MCS-90 Endorsement',
  'Cargo BMC-34 Filing',
  'UIIA Trailer Interchange',
];

export const IssueCertificateScreen: React.FC<IssueCertificateScreenProps> = ({
  company,
  quote,
  drivers,
  onBackHome,
  onStepChange,
  onUpdateQuote,
  onAddVehicle,
  onEditVehicle,
  onOpenSelectPicker,
  onToggleCoverage,
  onSaveLater,
  onSubmitQuote,
  scrollContainerRef,
}) => {
  const { scrollRef, onScroll } = useScrollPersistence('quote', scrollContainerRef);
  const [stepError, setStepError] = useState<string>('');

  const step = quote.currentStep;
  const percent = Math.round((step / quote.totalSteps) * 100);
  const includedCoverages = quote.coverages.filter((c) => c.group === 'included');
  const addonCoverages = quote.coverages.filter((c) => c.group === 'addon');
  const selectedAddonCount = addonCoverages.filter((c) => c.checked).length;

  const handleCargoInput = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, '');
    if (!digits) {
      onUpdateQuote({ maxCargoValue: '' });
      return;
    }
    onUpdateQuote({ maxCargoValue: Number(digits).toLocaleString('en-US') });
  };

  const handleAnnualMilesInput = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, '');
    if (!digits) {
      onUpdateQuote({ annualMiles: '' });
      return;
    }
    onUpdateQuote({ annualMiles: Number(digits).toLocaleString('en-US') });
  };

  const toggleDriverInQuote = (id: string) => {
    setStepError('');
    const exists = quote.selectedDriverIds.includes(id);
    const next = exists
      ? quote.selectedDriverIds.filter((item) => item !== id)
      : [...quote.selectedDriverIds, id];
    onUpdateQuote({ selectedDriverIds: next });
  };

  const toggleFilingOption = (label: string) => {
    const exists = quote.filingsNeeded.includes(label);
    const next = exists
      ? quote.filingsNeeded.filter((item) => item !== label)
      : [...quote.filingsNeeded, label];
    onUpdateQuote({ filingsNeeded: next });
  };

  const handleStepBack = () => {
    setStepError('');
    if (step > 1) {
      onStepChange((step - 1) as QuoteStep);
    } else {
      onBackHome();
    }
  };

  const handleContinue = () => {
    setStepError('');

    if (step === 1) {
      if (!quote.effectiveDate) {
        setStepError('Choose a policy effective start date.');
        return;
      }
      if (!/^[A-Z]{2}$/.test(quote.garagingState.trim().toUpperCase())) {
        setStepError('Enter a valid 2-letter garaging state (e.g. TX).');
        return;
      }
      onStepChange(2);
      return;
    }

    if (step === 2) {
      const milesNum = Number(quote.annualMiles.replace(/,/g, ''));
      if (!Number.isFinite(milesNum) || milesNum <= 0) {
        setStepError('Enter estimated annual fleet miles above 0.');
        return;
      }
      onStepChange(3);
      return;
    }

    if (step === 3) {
      if (quote.vehicles.length === 0) {
        setStepError('Add at least one vehicle before continuing.');
        return;
      }
      const cargoNum = Number(quote.maxCargoValue.replace(/,/g, ''));
      if (!Number.isFinite(cargoNum) || cargoNum <= 0) {
        setStepError('Enter a valid maximum cargo value above $0.');
        return;
      }
      onStepChange(4);
      return;
    }

    if (step === 4) {
      if (quote.selectedDriverIds.length === 0) {
        setStepError('Select at least one scheduled driver.');
        return;
      }
      onStepChange(5);
      return;
    }

    if (step === 5) {
      const yrs = Number(quote.yearsInBusiness);
      if (!Number.isFinite(yrs) || yrs < 0) {
        setStepError('Enter valid years in business (0 or more).');
        return;
      }
      onStepChange(6);
      return;
    }

    onSubmitQuote();
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col bg-[#F6F8FC]">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 min-h-0 scroll-area screen-enter"
      >
        {/* Progress Header */}
        <div className="bg-white px-4 pt-2 pb-4 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleStepBack}
              className="min-h-[44px] inline-flex items-center gap-1 text-[14px] font-semibold text-[#334155] hover:text-[#0F172A] -ml-1.5 px-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              {step > 1 ? `Step ${step - 1}` : 'Back to Home'}
            </button>
            <Badge tone="neutral">
              Step {step} of {quote.totalSteps}
            </Badge>
          </div>

          <h1 className="text-[20px] font-bold text-[#0F172A] tracking-tight mt-1">
            {STEP_META[step].title}
          </h1>
          <ProgressBar
            percent={percent}
            label={`Quote step ${step} of ${quote.totalSteps}`}
            className="mt-3"
          />

          {/* Compact interactive step pills */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {([1, 2, 3, 4, 5, 6] as QuoteStep[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setStepError('');
                  onStepChange(s);
                }}
                aria-current={step === s ? 'step' : undefined}
                className={`h-8 px-2.5 rounded-full text-[12px] font-semibold shrink-0 cursor-pointer transition-colors ${
                  step === s
                    ? 'bg-[#0F2A3F] text-white'
                    : s < step
                      ? 'bg-[#D9F2EA] text-[#0B6B5A]'
                      : 'bg-[#EEF3FB] text-[#475569]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-5 space-y-6">
          {stepError && (
            <div
              role="alert"
              className="rounded-2xl bg-[#FEE2E2] p-3.5 flex items-center gap-2.5 text-[#B91C1C] text-[13px] font-semibold"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{stepError}</span>
            </div>
          )}

          {/* STEP 1: Carrier & Policy Basics */}
          {step === 1 && (
            <div className="space-y-4">
              <Card padding="lg" className="space-y-3">
                <div className="text-[13px] font-semibold text-[#475569]">Motor Carrier</div>
                <div className="text-[16px] font-bold text-[#0F2A3F]">{company.name}</div>
                <div className="text-[13px] font-mono text-[#475569]">
                  USDOT {company.usdot} • {company.mc}
                </div>
              </Card>

              <Card padding="lg" className="space-y-4">
                <div>
                  <label
                    htmlFor="quote-effective-date"
                    className="block text-[14px] font-semibold text-[#0F172A] mb-1.5"
                  >
                    Desired effective date
                  </label>
                  <input
                    id="quote-effective-date"
                    type="date"
                    value={quote.effectiveDate}
                    onChange={(e) => {
                      setStepError('');
                      onUpdateQuote({ effectiveDate: e.target.value });
                    }}
                    className="w-full min-h-[44px] rounded-xl bg-[#EEF3FB] px-3.5 py-2 text-[15px] font-semibold text-[#0F172A] outline-none focus:bg-white focus:ring-2 focus:ring-[#0B6B5A]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="quote-garaging-state"
                    className="block text-[14px] font-semibold text-[#0F172A] mb-1.5"
                  >
                    Primary garaging state
                  </label>
                  <input
                    id="quote-garaging-state"
                    type="text"
                    maxLength={2}
                    value={quote.garagingState}
                    onChange={(e) => {
                      setStepError('');
                      onUpdateQuote({ garagingState: e.target.value.toUpperCase() });
                    }}
                    placeholder="TX"
                    className="w-full min-h-[44px] rounded-xl bg-[#EEF3FB] px-3.5 py-2 text-[15px] font-semibold text-[#0F172A] uppercase outline-none focus:bg-white focus:ring-2 focus:ring-[#0B6B5A]"
                  />
                </div>

                <div>
                  <div className="text-[14px] font-semibold text-[#0F172A] mb-2">
                    Primary Auto Liability Limit
                  </div>
                  <div className="space-y-2">
                    {(['$750,000 CSL', '$1,000,000 CSL', '$2,000,000 CSL'] as const).map(
                      (limit) => {
                        const active = quote.liabilityLimit === limit;
                        return (
                          <button
                            key={limit}
                            type="button"
                            onClick={() => onUpdateQuote({ liabilityLimit: limit })}
                            className={`w-full min-h-[44px] rounded-xl px-3.5 text-left text-[14px] font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                              active
                                ? 'bg-[#D9F2EA] text-[#0B6B5A] ring-2 ring-[#0B6B5A]'
                                : 'bg-[#EEF3FB] text-[#0F2A3F]'
                            }`}
                          >
                            <span>{limit}</span>
                            {active && <Check className="w-4 h-4 stroke-[2.5]" />}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* STEP 2: Authority & Operations */}
          {step === 2 && (
            <Card padding="lg" className="space-y-4">
              <div>
                <div className="text-[14px] font-semibold text-[#0F172A] mb-2">
                  Operating Authority Scope
                </div>
                <div className="space-y-2">
                  {(
                    [
                      'Interstate (48 States)',
                      'Regional Multi-State',
                      'Intrastate Only',
                    ] as const
                  ).map((scope) => {
                    const active = quote.authorityScope === scope;
                    return (
                      <button
                        key={scope}
                        type="button"
                        onClick={() => onUpdateQuote({ authorityScope: scope })}
                        className={`w-full min-h-[44px] rounded-xl px-3.5 text-left text-[14px] font-semibold flex items-center justify-between cursor-pointer ${
                          active
                            ? 'bg-[#D9F2EA] text-[#0B6B5A] ring-2 ring-[#0B6B5A]'
                            : 'bg-[#EEF3FB] text-[#0F2A3F]'
                        }`}
                      >
                        <span>{scope}</span>
                        {active && <Check className="w-4 h-4 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-[14px] font-semibold text-[#0F172A] mb-2">
                  Operating Radius
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['100 mi', '300 mi', '500+ mi'] as const).map((rad) => {
                    const active = quote.operatingRadius === rad;
                    return (
                      <button
                        key={rad}
                        type="button"
                        onClick={() => onUpdateQuote({ operatingRadius: rad })}
                        className={`min-h-[44px] rounded-xl text-[13px] font-semibold cursor-pointer ${
                          active
                            ? 'bg-[#0F2A3F] text-white'
                            : 'bg-[#EEF3FB] text-[#0F2A3F]'
                        }`}
                      >
                        {rad}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="quote-annual-miles"
                  className="block text-[14px] font-semibold text-[#0F172A] mb-1.5"
                >
                  Estimated annual fleet miles
                </label>
                <input
                  id="quote-annual-miles"
                  type="text"
                  inputMode="numeric"
                  value={quote.annualMiles}
                  onChange={(e) => {
                    setStepError('');
                    handleAnnualMilesInput(e.target.value);
                  }}
                  className="w-full min-h-[44px] rounded-xl bg-[#EEF3FB] px-3.5 py-2 font-mono text-[15px] font-bold text-[#0F172A] outline-none focus:bg-white focus:ring-2 focus:ring-[#0B6B5A]"
                />
              </div>

              <button
                type="button"
                aria-pressed={quote.hazmat}
                onClick={() => onUpdateQuote({ hazmat: !quote.hazmat })}
                className={`w-full min-h-[48px] rounded-xl px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer ${
                  quote.hazmat ? 'bg-[#D9F2EA] text-[#0B6B5A]' : 'bg-[#EEF3FB] text-[#0F2A3F]'
                }`}
              >
                <div>
                  <div className="text-[14px] font-semibold">Hauling hazardous materials?</div>
                  <div className="text-[12px] text-[#475569]">
                    Placarded loads require higher liability endorsement
                  </div>
                </div>
                <span className="text-[13px] font-bold">{quote.hazmat ? 'Yes' : 'No'}</span>
              </button>
            </Card>
          )}

          {/* STEP 3: Vehicles & Equipment (preserves existing layout) */}
          {step === 3 && (
            <>
              <section className="space-y-3">
                <SectionHeader
                  title="Vehicles"
                  rightText={`${quote.vehicles.length} scheduled`}
                />

                {quote.vehicles.length === 0 ? (
                  <EmptyState
                    icon={<Truck className="w-6 h-6" />}
                    title="No vehicles added"
                    description="Add at least one truck or tractor to continue your quote."
                    actionLabel="Add Vehicle"
                    onAction={onAddVehicle}
                  />
                ) : (
                  <div className="space-y-3">
                    {quote.vehicles.map((v) => (
                      <Card key={v.id} padding="lg" className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-[16px] font-bold text-[#0F172A] truncate">
                            {v.name}
                          </h3>
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

                    <Button variant="outline-light" fullWidth size="lg" onClick={onAddVehicle}>
                      <Plus className="w-4 h-4" />
                      Add Vehicle
                    </Button>
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <SectionHeader title="Trailer & Cargo" />
                <Card padding="lg" className="space-y-4">
                  <InFrameSelect
                    label="Primary trailer type"
                    value={quote.trailerType}
                    options={TRAILER_TYPES}
                    icon={<Container className="w-4 h-4" />}
                    onSelect={(val) => onUpdateQuote({ trailerType: val })}
                    onOpenPicker={onOpenSelectPicker}
                  />

                  <InFrameSelect
                    label="Cargo classification"
                    value={quote.cargoClass}
                    options={CARGO_CLASSIFICATIONS}
                    icon={<Package className="w-4 h-4" />}
                    onSelect={(val) => onUpdateQuote({ cargoClass: val })}
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
                        value={quote.maxCargoValue}
                        onChange={(e) => {
                          setStepError('');
                          handleCargoInput(e.target.value);
                        }}
                        className="flex-1 min-w-0 bg-transparent font-mono text-[16px] font-bold text-[#0F172A] outline-none py-2"
                      />
                    </div>
                    <p className="text-[14px] text-[#475569] mt-1.5">Average value per load</p>
                  </div>
                </Card>
              </section>

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
            </>
          )}

          {/* STEP 4: Driver Schedule */}
          {step === 4 && (
            <section className="space-y-3">
              <SectionHeader
                title="Active Drivers"
                rightText={`${quote.selectedDriverIds.length} selected`}
              />
              <div className="space-y-2.5">
                {drivers.map((drv) => {
                  const selected = quote.selectedDriverIds.includes(drv.id);
                  return (
                    <button
                      key={drv.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleDriverInQuote(drv.id)}
                      className={`w-full min-h-[64px] rounded-2xl p-4 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#D9F2EA]/50 ring-2 ring-[#0B6B5A]'
                          : 'bg-white shadow-[0_1px_4px_rgba(15,23,42,0.05)]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-[15px] font-bold text-[#0F172A] truncate">
                          {drv.name}
                        </div>
                        <div className="text-[13px] text-[#475569] truncate mt-0.5">
                          {drv.cdlNumber} ({drv.cdlState}) • Med valid {formatShortDate(drv.medicalExpiryIso)}
                        </div>
                        <div className="text-[12px] text-[#64748B] mt-0.5">
                          {formatExpiryCountdown(drv.medicalExpiryIso)}
                        </div>
                      </div>
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                          selected
                            ? 'bg-[#0B6B5A] text-white'
                            : 'bg-[#EEF3FB] border border-[#CBD5E1]'
                        }`}
                      >
                        {selected && <Check className="w-4 h-4 stroke-[2.75]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* STEP 5: Loss Runs & Filings */}
          {step === 5 && (
            <div className="space-y-4">
              <Card padding="lg" className="space-y-4">
                <div>
                  <label
                    htmlFor="quote-prior-carrier"
                    className="block text-[14px] font-semibold text-[#0F172A] mb-1.5"
                  >
                    Prior / current insurer
                  </label>
                  <input
                    id="quote-prior-carrier"
                    type="text"
                    value={quote.priorCarrier}
                    onChange={(e) => onUpdateQuote({ priorCarrier: e.target.value })}
                    className="w-full min-h-[44px] rounded-xl bg-[#EEF3FB] px-3.5 py-2 text-[15px] font-semibold text-[#0F172A] outline-none focus:bg-white focus:ring-2 focus:ring-[#0B6B5A]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="quote-years-business"
                    className="block text-[14px] font-semibold text-[#0F172A] mb-1.5"
                  >
                    Years operating under USDOT
                  </label>
                  <input
                    id="quote-years-business"
                    type="text"
                    inputMode="numeric"
                    value={quote.yearsInBusiness}
                    onChange={(e) => {
                      setStepError('');
                      onUpdateQuote({ yearsInBusiness: e.target.value.replace(/[^\d]/g, '') });
                    }}
                    className="w-full min-h-[44px] rounded-xl bg-[#EEF3FB] px-3.5 py-2 font-mono text-[15px] font-bold text-[#0F172A] outline-none focus:bg-white focus:ring-2 focus:ring-[#0B6B5A]"
                  />
                </div>

                <div>
                  <div className="text-[14px] font-semibold text-[#0F172A] mb-2">
                    3-Year Loss History
                  </div>
                  <div className="space-y-2">
                    {(['0 claims (Clean 3 yrs)', '1 minor claim', '2+ claims'] as const).map(
                      (loss) => {
                        const active = quote.lossHistory === loss;
                        return (
                          <button
                            key={loss}
                            type="button"
                            onClick={() => onUpdateQuote({ lossHistory: loss })}
                            className={`w-full min-h-[44px] rounded-xl px-3.5 text-left text-[14px] font-semibold flex items-center justify-between cursor-pointer ${
                              active
                                ? 'bg-[#D9F2EA] text-[#0B6B5A] ring-2 ring-[#0B6B5A]'
                                : 'bg-[#EEF3FB] text-[#0F2A3F]'
                            }`}
                          >
                            <span>{loss}</span>
                            {active && <Check className="w-4 h-4 stroke-[2.5]" />}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              </Card>

              <Card padding="lg" className="space-y-2.5">
                <div className="text-[14px] font-semibold text-[#0F172A]">
                  Filings required upon bind
                </div>
                {FILING_OPTIONS.map((opt) => {
                  const checked = quote.filingsNeeded.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={checked}
                      onClick={() => toggleFilingOption(opt)}
                      className={`w-full min-h-[44px] rounded-xl px-3.5 flex items-center justify-between text-left text-[14px] font-medium cursor-pointer ${
                        checked
                          ? 'bg-[#D9F2EA]/70 text-[#0B6B5A]'
                          : 'bg-[#F6F8FC] text-[#334155]'
                      }`}
                    >
                      <span>{opt}</span>
                      <span className="font-semibold">{checked ? 'Included' : 'Optional'}</span>
                    </button>
                  );
                })}
              </Card>
            </div>
          )}

          {/* STEP 6: Review & Submit */}
          {step === 6 && (
            <div className="space-y-4">
              <Card padding="lg" className="space-y-3">
                <div className="text-[14px] font-bold text-[#0F2A3F]">Quote Summary</div>
                <div className="grid grid-cols-2 gap-3 text-[13px]">
                  <div>
                    <div className="text-[#64748B]">Carrier</div>
                    <div className="font-semibold text-[#0F172A]">{company.name}</div>
                  </div>
                  <div>
                    <div className="text-[#64748B]">Effective</div>
                    <div className="font-semibold text-[#0F172A]">{quote.effectiveDate}</div>
                  </div>
                  <div>
                    <div className="text-[#64748B]">Liability Limit</div>
                    <div className="font-semibold text-[#0F172A]">{quote.liabilityLimit}</div>
                  </div>
                  <div>
                    <div className="text-[#64748B]">Operations</div>
                    <div className="font-semibold text-[#0F172A]">{quote.operatingRadius}</div>
                  </div>
                  <div>
                    <div className="text-[#64748B]">Scheduled Fleet</div>
                    <div className="font-semibold text-[#0F172A]">
                      {quote.vehicles.length} truck{quote.vehicles.length === 1 ? '' : 's'} •{' '}
                      {quote.selectedDriverIds.length} driver{quote.selectedDriverIds.length === 1 ? '' : 's'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#64748B]">Trailer / Cargo</div>
                    <div className="font-semibold text-[#0F172A]">
                      {quote.trailerType} • ${quote.maxCargoValue}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#64748B]">Add-on Coverages</div>
                    <div className="font-semibold text-[#0F172A]">{selectedAddonCount} selected</div>
                  </div>
                  <div>
                    <div className="text-[#64748B]">Filings</div>
                    <div className="font-semibold text-[#0F172A]">
                      {quote.filingsNeeded.length} requested
                    </div>
                  </div>
                </div>
              </Card>

              <Card padding="lg" className="space-y-2">
                <label
                  htmlFor="quote-notes"
                  className="block text-[14px] font-semibold text-[#0F172A]"
                >
                  Notes for Sarah Jenkins (optional)
                </label>
                <textarea
                  id="quote-notes"
                  rows={3}
                  value={quote.submissionNotes}
                  onChange={(e) => onUpdateQuote({ submissionNotes: e.target.value })}
                  placeholder="Share target deductibles, broker certificates, or timing notes..."
                  className="w-full rounded-xl bg-[#EEF3FB] px-3.5 py-2.5 text-[15px] text-[#0F172A] placeholder:text-[#64748B] outline-none focus:bg-white focus:ring-2 focus:ring-[#0B6B5A] resize-none"
                />
              </Card>
            </div>
          )}
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
            variant={step === 6 ? 'teal' : 'primary'}
            size="lg"
            onClick={handleContinue}
            className="flex-1"
          >
            {STEP_META[step].nextLabel}
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
