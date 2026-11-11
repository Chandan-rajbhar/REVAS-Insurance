import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  PhoneOff,
  Send,
  Share2,
  ShieldCheck,
  Star,
  Trash2,
  Truck,
  UploadCloud,
} from 'lucide-react';
import {
  ADVISOR,
  COMPANY,
  HOME_IMAGES,
  INITIAL_REQUESTS,
  POLICIES,
  type FleetDriver,
  type FleetTruck,
  type PolicyItem,
  type RequestItem,
  type ServiceItem,
  type VaultDocument,
  type VehicleItem,
} from '../data/mock';
import { Badge, Button, InFrameBottomSheet, ResponsivePhoto } from './ui';

export type ActiveSheet =
  | null
  | { type: 'help' }
  | { type: 'legal-security' }
  | { type: 'call'; title: string; subtitle: string; numberLabel: string }
  | { type: 'message-sarah' }
  | { type: 'policies-list' }
  | { type: 'invoices-list' }
  | { type: 'fleet-truck-details'; truck: FleetTruck }
  | { type: 'fleet-truck-form'; mode: 'add' | 'edit'; truck?: FleetTruck }
  | { type: 'fleet-driver-details'; driver: FleetDriver }
  | { type: 'fleet-driver-form'; mode: 'add' | 'edit'; driver?: FleetDriver }
  | { type: 'policy-details'; policy: PolicyItem }
  | { type: 'coi-preview'; policy: PolicyItem }
  | { type: 'vehicle-form'; mode: 'add' | 'edit'; vehicle?: VehicleItem }
  | {
      type: 'select-picker';
      title: string;
      options: string[];
      current: string;
      onSelect: (value: string) => void;
    }
  | { type: 'service-details'; service: ServiceItem }
  | { type: 'service-confirm'; service: ServiceItem }
  | { type: 'upload-doc'; presetTitle?: string }
  | { type: 'doc-preview'; doc: VaultDocument }
  | { type: 'doc-menu'; doc: VaultDocument }
  | { type: 'send-shipper'; doc: VaultDocument }
  | { type: 'invoice'; req: RequestItem }
  | { type: 'write-review' };

interface OverlaysProps {
  sheet: ActiveSheet;
  onClose: () => void;
  onOpenSheet: (sheet: ActiveSheet) => void;
  onSaveVehicle: (vehicle: Omit<VehicleItem, 'id'>, editId?: string) => void;
  onRemoveVehicle: (vehicle: VehicleItem) => void;
  onSaveFleetTruck: (truck: Omit<FleetTruck, 'id'>, editId?: string) => void;
  onRemoveFleetTruck: (truck: FleetTruck) => void;
  onSaveFleetDriver: (driver: Omit<FleetDriver, 'id'>, editId?: string) => void;
  onRemoveFleetDriver: (driver: FleetDriver) => void;
  onConfirmService: (service: ServiceItem) => void;
  onConfirmUploadDoc: (
    title: string,
    category: VaultDocument['category'],
    fileName: string,
  ) => void;
  onSubmitReview: (rating: number, text: string) => void;
  onShowToast: (message: string, tone?: 'success' | 'info' | 'warning') => void;
}

export const Overlays: React.FC<OverlaysProps> = ({
  sheet,
  onClose,
  onOpenSheet,
  onSaveVehicle,
  onRemoveVehicle,
  onSaveFleetTruck,
  onRemoveFleetTruck,
  onSaveFleetDriver,
  onRemoveFleetDriver,
  onConfirmService,
  onConfirmUploadDoc,
  onSubmitReview,
  onShowToast,
}) => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ from: 'sarah' | 'user'; text: string; time: string }[]>(
    [
      {
        from: 'sarah',
        text: 'Hi! I am reviewing your Fleet Policy Quote (Step 3 of 6). Once Marcus Vance’s driving record (MVR) is uploaded, we can lock your rate.',
        time: '10:42 AM',
      },
    ],
  );
  const [shipperEmail, setShipperEmail] = useState('compliance@chrobinson.com');

  if (!sheet) return null;

  if (sheet.type === 'help') {
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title="Support"
        subtitle={`Your advisor: ${ADVISOR.name} • ${ADVISOR.role}`}
      >
        <div className="space-y-3">
          <div className="rounded-2xl bg-[#F6F8FC] p-4 flex items-center gap-3.5">
            <ResponsivePhoto
              asset={HOME_IMAGES.advisor}
              className="w-12 h-12 rounded-full shrink-0"
              imgClassName="object-cover object-top"
            />
            <div className="min-w-0 space-y-0.5">
              <div className="text-[15px] font-bold text-[#0F172A] truncate">{ADVISOR.name}</div>
              <div className="text-[14px] text-[#475569] truncate">{ADVISOR.role}</div>
              <div className="font-mono text-[14px] font-semibold text-[#0B6B5A] pt-0.5">
                {ADVISOR.phone}
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={() =>
              onOpenSheet({
                type: 'call',
                title: ADVISOR.name,
                subtitle: ADVISOR.role,
                numberLabel: ADVISOR.phone,
              })
            }
          >
            <Phone className="w-4 h-4" />
            Call {ADVISOR.name}
          </Button>

          <Button
            variant="secondary"
            fullWidth
            size="md"
            onClick={() => onOpenSheet({ type: 'message-sarah' })}
          >
            <MessageSquare className="w-4 h-4" />
            Message {ADVISOR.name}
          </Button>
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'legal-security') {
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title="Legal & security"
        subtitle={COMPANY.name}
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F6F8FC] p-4 space-y-2">
            <div className="text-[15px] font-bold text-[#0F172A]">Document &amp; data security</div>
            <p className="text-[14px] text-[#475569] leading-relaxed">
              Fleet certificates, driver credentials, and vehicle schedules are protected with
              256-bit AES encryption in transit and at rest.
            </p>
          </div>

          <div className="rounded-2xl bg-[#F6F8FC] p-4 space-y-2">
            <div className="text-[15px] font-bold text-[#0F172A]">Regulatory disclosure</div>
            <p className="text-[14px] text-[#475569] leading-relaxed">
              REVAS is a private DOT compliance filing service and licensed commercial insurance
              brokerage, not a government agency.
            </p>
          </div>

          <Button variant="primary" fullWidth onClick={onClose}>
            Close
          </Button>
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'call') {
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title="Calling... (demo)"
        subtitle="In-app call preview"
      >
        <div className="py-3 flex flex-col items-center text-center">
          <div className="relative">
            <ResponsivePhoto
              asset={HOME_IMAGES.advisor}
              className="w-20 h-20 rounded-full ring-4 ring-[#D9F2EA]"
              imgClassName="object-cover object-top"
            />
            <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#0B6B5A] text-white flex items-center justify-center ring-2 ring-white">
              <Phone className="w-3.5 h-3.5 animate-pulse" />
            </span>
          </div>
          <div className="mt-3 text-[17px] font-bold text-[#0F172A]">{sheet.title}</div>
          <div className="text-[14px] text-[#475569] mt-0.5">{sheet.subtitle}</div>
          <div className="font-mono text-[14px] font-bold text-[#0B6B5A] bg-[#D9F2EA] px-3.5 py-1 rounded-full mt-3">
            {sheet.numberLabel}
          </div>
          <p className="text-[14px] text-[#475569] mt-3 max-w-[280px] leading-snug">
            In-app call preview is active so external phone apps are not opened.
          </p>
          <Button variant="danger" fullWidth size="lg" onClick={onClose} className="mt-5">
            <PhoneOff className="w-4 h-4" />
            End Call
          </Button>
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'message-sarah') {
    const sendChat = () => {
      const trimmed = chatInput.trim();
      if (!trimmed) return;
      setMessages((prev) => [...prev, { from: 'user', text: trimmed, time: 'Just now' }]);
      setChatInput('');
      onShowToast(`Message sent to ${ADVISOR.name}`);
    };

    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title={`Message ${ADVISOR.name}`}
        subtitle={ADVISOR.role}
      >
        <div className="space-y-3">
          <div className="space-y-2.5 max-h-[34dvh] overflow-y-auto no-scrollbar">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.from === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed ${
                    m.from === 'user'
                      ? 'bg-[#0F2A3F] text-white rounded-br-sm'
                      : 'bg-[#EEF3FB] text-[#0F172A] rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[12px] text-[#475569] mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {['Uploading MVR today', 'Please call me', 'Send certificate copy'].map((quick) => (
              <button
                key={quick}
                type="button"
                onClick={() => setChatInput(quick)}
                className="min-h-[44px] inline-flex items-center rounded-full bg-[#EEF3FB] hover:bg-[#E2EAF6] text-[#0F172A] text-[13px] font-semibold px-3.5 py-2 cursor-pointer"
              >
                {quick}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChat()}
              placeholder={`Message ${ADVISOR.name}...`}
              aria-label={`Message ${ADVISOR.name}`}
              className="flex-1 bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 text-[16px] text-[#0F172A] outline-none min-h-[44px]"
            />
            <Button variant="teal" size="md" onClick={sendChat} aria-label="Send message">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'policies-list') {
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title="Active Policies"
        subtitle={`${POLICIES.length} active • ${COMPANY.name}`}
      >
        <div className="space-y-2.5">
          {POLICIES.map((policy) => (
            <button
              key={policy.id}
              type="button"
              onClick={() => onOpenSheet({ type: 'policy-details', policy })}
              className="w-full min-h-[64px] rounded-2xl bg-[#F6F8FC] hover:bg-[#EEF3FB] p-3.5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
            >
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-[#0F2A3F] truncate">
                  {policy.name}
                </div>
                <div className="text-[13px] text-[#64748B] truncate mt-0.5">
                  {policy.carrier} · {policy.coverageValue}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge tone="teal">{policy.status}</Badge>
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              </div>
            </button>
          ))}
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'invoices-list') {
    const invoiceItems: RequestItem[] = [
      ...INITIAL_REQUESTS.filter((r) => Boolean(r.receiptAmount)),
      {
        id: 'inv-pol-auto',
        ref: 'INV-PRG-99042',
        timestamp: 'Nov 30, 2024',
        statusLabel: 'Paid',
        statusTone: 'teal',
        filterTags: ['cleared'],
        title: 'Primary Auto Liability Installment',
        subtitle: 'Progressive Commercial • PRG-99042',
        receiptAmount: '$1,420.00 Paid',
      },
      {
        id: 'inv-pol-cargo',
        ref: 'INV-LLY-44021',
        timestamp: 'Nov 30, 2024',
        statusLabel: 'Paid',
        statusTone: 'teal',
        filterTags: ['cleared'],
        title: 'Motor Truck Cargo Policy Fee',
        subtitle: "Lloyd's Syndicate • LLY-44021",
        receiptAmount: '$385.00 Paid',
      },
    ];

    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title="Invoices & payments"
        subtitle="Receipts and filing fees"
      >
        <div className="space-y-2.5">
          {invoiceItems.map((inv) => (
            <button
              key={inv.id}
              type="button"
              onClick={() => onOpenSheet({ type: 'invoice', req: inv })}
              className="w-full min-h-[64px] rounded-2xl bg-[#F6F8FC] hover:bg-[#EEF3FB] p-3.5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
            >
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-[#0F2A3F] truncate">
                  {inv.title}
                </div>
                <div className="text-[13px] text-[#64748B] truncate mt-0.5">
                  {inv.ref} · {inv.timestamp}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[13px] font-semibold text-[#0B6B5A]">
                  {inv.receiptAmount}
                </span>
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              </div>
            </button>
          ))}
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'fleet-truck-details') {
    const t = sheet.truck;
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title={t.name}
        subtitle={`${t.unitNumber} · ${t.operationType}`}
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F6F8FC] p-4 grid grid-cols-2 gap-3.5">
            <div>
              <div className="text-[12px] font-medium text-[#475569]">Cab type</div>
              <div className="text-[14px] font-semibold text-[#0F172A] mt-0.5">{t.cab}</div>
            </div>
            <div>
              <div className="text-[12px] font-medium text-[#475569]">Stated value</div>
              <div className="text-[14px] font-semibold text-[#0F172A] mt-0.5">{t.statedValue}</div>
            </div>
            <div>
              <div className="text-[12px] font-medium text-[#475569]">Operating radius</div>
              <div className="text-[14px] font-semibold text-[#0F172A] mt-0.5">{t.radius}</div>
            </div>
            <div>
              <div className="text-[12px] font-medium text-[#475569]">Coverage status</div>
              <div className="mt-1">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                    t.status === 'Insured'
                      ? 'bg-[#D9F2EA] text-[#0B6B5A]'
                      : 'bg-[#FEF3C7] text-[#B45309]'
                  }`}
                >
                  {t.status}
                </span>
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-[12px] font-medium text-[#475569]">VIN</div>
              <div className="font-mono text-[14px] font-semibold text-[#0F172A] mt-0.5">
                {t.vin}
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={() => onOpenSheet({ type: 'fleet-truck-form', mode: 'edit', truck: t })}
          >
            <Truck className="w-4 h-4" />
            Edit truck
          </Button>
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'fleet-truck-form') {
    const isEdit = sheet.mode === 'edit';
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title={isEdit ? 'Edit Truck' : 'Add Truck'}
        subtitle={COMPANY.name}
      >
        <VehicleFormBody
          key={isEdit && sheet.truck ? `fleet-edit-${sheet.truck.id}` : 'fleet-add'}
          isEdit={isEdit}
          showFleetFields
          initialVehicle={sheet.truck}
          initialUnitNumber={sheet.truck?.unitNumber}
          initialStatus={sheet.truck?.status}
          submitLabel={isEdit ? 'Save Changes' : 'Add Truck'}
          removeLabel="Remove Truck"
          onCancel={onClose}
          onSave={(vehicleData, editId, fleetMeta) =>
            onSaveFleetTruck(
              {
                ...vehicleData,
                unitNumber: fleetMeta?.unitNumber || 'Unit #107',
                status: fleetMeta?.status || 'Insured',
              },
              editId,
            )
          }
          onRemove={
            isEdit && sheet.truck
              ? () => {
                  const target = sheet.truck!;
                  onClose();
                  onRemoveFleetTruck(target);
                }
              : undefined
          }
        />
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'fleet-driver-details') {
    const d = sheet.driver;
    const badgeClass =
      d.statusTone === 'red'
        ? 'bg-[#FDE9E9] text-[#B91C1C]'
        : d.statusTone === 'amber'
          ? 'bg-[#FEF3C7] text-[#B45309]'
          : 'bg-[#D9F2EA] text-[#0B6B5A]';

    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title={d.name}
        subtitle={`${d.cdlNumber} · ${d.cdlState}`}
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F6F8FC] p-4 grid grid-cols-2 gap-3.5">
            <div>
              <div className="text-[12px] font-medium text-[#475569]">Assigned truck</div>
              <div className="text-[14px] font-semibold text-[#0F172A] mt-0.5">
                {d.assignedUnit}
              </div>
            </div>
            <div>
              <div className="text-[12px] font-medium text-[#475569]">Status</div>
              <div className="mt-1">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] font-medium ${badgeClass}`}
                >
                  {d.statusLabel}
                </span>
              </div>
            </div>
            <div>
              <div className="text-[12px] font-medium text-[#475569]">Medical card expires</div>
              <div className="text-[14px] font-semibold text-[#0F172A] mt-0.5">
                {d.medicalValidUntil}
              </div>
            </div>
            <div>
              <div className="text-[12px] font-medium text-[#475569]">Phone</div>
              <div className="font-mono text-[14px] font-semibold text-[#0F172A] mt-0.5">
                {d.phone}
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={() => onOpenSheet({ type: 'fleet-driver-form', mode: 'edit', driver: d })}
          >
            Edit driver
          </Button>

          {d.statusTone === 'red' && (
            <Button
              variant="secondary"
              fullWidth
              size="md"
              onClick={() =>
                onOpenSheet({
                  type: 'upload-doc',
                  presetTitle: `DOT Medical Card — ${d.name}`,
                })
              }
            >
              <UploadCloud className="w-4 h-4" />
              Upload medical card
            </Button>
          )}
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'fleet-driver-form') {
    const isEdit = sheet.mode === 'edit';
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title={isEdit ? 'Edit Driver' : 'Add Driver'}
        subtitle={COMPANY.name}
      >
        <DriverFormBody
          key={isEdit && sheet.driver ? `drv-edit-${sheet.driver.id}` : 'drv-add'}
          isEdit={isEdit}
          initialDriver={sheet.driver}
          onCancel={onClose}
          onSave={onSaveFleetDriver}
          onRemove={
            isEdit && sheet.driver
              ? () => {
                  const target = sheet.driver!;
                  onClose();
                  onRemoveFleetDriver(target);
                }
              : undefined
          }
        />
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'write-review') {
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title="Write a review"
        subtitle={COMPANY.name}
      >
        <WriteReviewBody onCancel={onClose} onSubmit={onSubmitReview} />
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'policy-details') {
    const p = sheet.policy;
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title={p.name}
        subtitle={`${p.carrier} • ${p.policyNumber}`}
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F6F8FC] p-4 grid grid-cols-2 gap-3.5">
            <div>
              <div className="text-[12px] font-medium text-[#475569]">Coverage limit</div>
              <div className="text-[15px] font-bold text-[#0F172A] mt-0.5">{p.coverageValue}</div>
            </div>
            <div>
              <div className="text-[12px] font-medium text-[#475569]">Expires</div>
              <div className="text-[15px] font-bold text-[#0F172A] mt-0.5">{p.validThruValue}</div>
            </div>
            <div>
              <div className="text-[12px] font-medium text-[#475569]">Deductible</div>
              <div className="text-[14px] font-semibold text-[#0F172A] mt-0.5">{p.deductible}</div>
            </div>
            <div>
              <div className="text-[12px] font-medium text-[#475569]">Covered units</div>
              <div className="text-[14px] font-semibold text-[#0F172A] mt-0.5">{p.unitsCovered}</div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-[#D9F2EA] p-4">
            <div className="flex items-center gap-2 text-[14px] font-semibold text-[#0B6B5A]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>FMCSA filing verified</span>
            </div>
            <Badge tone="teal">{p.status}</Badge>
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={() => onOpenSheet({ type: 'coi-preview', policy: p })}
          >
            View Certificate (COI)
          </Button>
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'coi-preview') {
    const p = sheet.policy;
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title="Certificate of Insurance"
        subtitle={`${p.policyNumber} • ${COMPANY.name}`}
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F6F8FC] p-4 space-y-2.5 text-[14px] text-[#334155]">
            <div className="flex items-center justify-between gap-2 pb-2">
              <span className="font-bold text-[#0F172A]">{p.name}</span>
              <Badge tone="teal">Active</Badge>
            </div>
            <div>
              <span className="text-[#475569]">Carrier:</span> {COMPANY.name}
            </div>
            <div>
              <span className="text-[#475569]">Insurer:</span> {p.carrier}
            </div>
            <div className="font-mono">
              <span className="font-sans text-[#475569]">Policy:</span> {p.policyNumber}
            </div>
            <div>
              <span className="text-[#475569]">Expires:</span> {p.validThruValue}
            </div>
          </div>

          <div className="btn-row-responsive grid grid-cols-2 gap-2.5">
            <Button
              variant="secondary"
              onClick={() => {
                onClose();
                onShowToast('PDF certificate downloaded');
              }}
            >
              Download PDF
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onShowToast(`Certificate emailed to ${COMPANY.email}`);
              }}
            >
              Email Copy
            </Button>
          </div>
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'vehicle-form') {
    const isEdit = sheet.mode === 'edit';
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title={isEdit ? 'Edit Vehicle' : 'Add Vehicle'}
        subtitle="Fleet Policy Quote • Step 3 of 6"
      >
        <VehicleFormBody
          key={isEdit && sheet.vehicle ? `edit-${sheet.vehicle.id}` : 'add'}
          isEdit={isEdit}
          initialVehicle={sheet.vehicle}
          onCancel={onClose}
          onSave={onSaveVehicle}
          onRemove={
            isEdit && sheet.vehicle
              ? () => {
                  const target = sheet.vehicle!;
                  onClose();
                  onRemoveVehicle(target);
                }
              : undefined
          }
        />
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'select-picker') {
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title={sheet.title}
        subtitle="Select one option"
      >
        <div className="space-y-2">
          {sheet.options.map((opt) => {
            const active = opt === sheet.current;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  sheet.onSelect(opt);
                  onClose();
                }}
                className={`w-full min-h-[44px] text-left rounded-xl px-4 py-3 flex items-center justify-between gap-2 text-[14px] font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#D9F2EA] text-[#0B6B5A]'
                    : 'bg-[#F6F8FC] hover:bg-[#EEF3FB] text-[#0F172A]'
                }`}
              >
                <span>{opt}</span>
                {active && <Check className="w-4 h-4 stroke-[2.5] shrink-0" />}
              </button>
            );
          })}
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'service-details') {
    const s = sheet.service;
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title={s.title}
        subtitle={s.section}
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F6F8FC] p-4 space-y-3">
            <Badge tone={s.tag.tone}>{s.tag.label}</Badge>
            <p className="text-[14px] text-[#334155] leading-relaxed">
              {s.description}
            </p>
            <div
              className="pt-3 flex items-baseline justify-between gap-3"
              style={{ borderTop: '0.5px solid #E1E5EC' }}
            >
              <span className="text-[13px] font-medium text-[#475569]">Price</span>
              <span className="text-[18px] font-bold text-[#0F172A]">{s.price}</span>
            </div>
          </div>

          <div className="btn-row-responsive grid grid-cols-2 gap-2.5">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => onOpenSheet({ type: 'service-confirm', service: s })}
            >
              {s.ctaLabel}
            </Button>
          </div>
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'service-confirm') {
    const s = sheet.service;
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title={`Request ${s.title}`}
        subtitle={COMPANY.name}
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F6F8FC] p-4 space-y-2.5 text-[14px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#475569]">Company</span>
              <span className="font-semibold text-[#0F172A]">{COMPANY.name}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#475569]">Authority</span>
              <span className="font-mono font-semibold text-[#0F172A]">
                USDOT {COMPANY.usdot}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-2">
              <span className="text-[#475569]">Price</span>
              <span className="text-[16px] font-bold text-[#0B6B5A]">{s.price}</span>
            </div>
          </div>

          <p className="text-[14px] text-[#475569] leading-relaxed">
            This submits a filing request to {ADVISOR.name} and adds it to your Requests list.
          </p>

          <div className="btn-row-responsive grid grid-cols-2 gap-2.5">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="teal" onClick={() => onConfirmService(s)}>
              Submit Request
            </Button>
          </div>
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'upload-doc') {
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title="Add Document"
        subtitle="Select category and file to upload"
      >
        <UploadDocBody
          key={sheet.presetTitle || 'default-upload'}
          presetTitle={sheet.presetTitle}
          onConfirm={onConfirmUploadDoc}
        />
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'doc-preview') {
    const doc = sheet.doc;
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title={doc.title}
        subtitle={`${doc.category} • ${doc.metaLine}`}
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F6F8FC] p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-[#0B6B5A] shrink-0" />
                <span className="text-[14px] font-semibold text-[#0F172A] truncate">
                  {COMPANY.name}
                </span>
              </div>
              <Badge tone={doc.statusTone}>
                {doc.statusTone === 'red' ? 'Expiring soon' : 'Active'}
              </Badge>
            </div>
            <p className="text-[14px] text-[#334155] leading-relaxed">{doc.previewSummary}</p>
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={() => onOpenSheet({ type: 'send-shipper', doc })}
          >
            <Mail className="w-4 h-4" />
            Send to Shipper
          </Button>

          <div className="btn-row-responsive grid grid-cols-2 gap-2.5">
            <Button
              variant="secondary"
              onClick={() => {
                onClose();
                onShowToast(`Share link copied for ${doc.title}`);
              }}
            >
              <Share2 className="w-4 h-4" />
              Share Link
            </Button>
            <Button
              variant="secondary"
              onClick={() => onOpenSheet({ type: 'upload-doc', presetTitle: doc.title })}
            >
              <UploadCloud className="w-4 h-4" />
              Replace File
            </Button>
          </div>
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'doc-menu') {
    const doc = sheet.doc;
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title={doc.title}
        subtitle={doc.category}
      >
        <div className="space-y-2.5">
          <Button
            variant="primary"
            fullWidth
            onClick={() => onOpenSheet({ type: 'doc-preview', doc })}
          >
            View Document
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => onOpenSheet({ type: 'send-shipper', doc })}
          >
            Send to Shipper
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              onClose();
              onShowToast(`Share link copied for ${doc.title}`);
            }}
          >
            Copy Share Link
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => onOpenSheet({ type: 'upload-doc', presetTitle: doc.title })}
          >
            Replace Document
          </Button>
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'send-shipper') {
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title="Send to Shipper"
        subtitle={sheet.doc.title}
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="shipper-email-input"
              className="block text-[14px] font-semibold text-[#0F172A] mb-1.5"
            >
              Recipient email
            </label>
            <input
              id="shipper-email-input"
              type="email"
              value={shipperEmail}
              onChange={(e) => setShipperEmail(e.target.value)}
              className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 text-[16px] text-[#0F172A] outline-none min-h-[44px]"
            />
          </div>
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={() => {
              onClose();
              onShowToast(`Sent document to ${shipperEmail}`);
            }}
          >
            <Send className="w-4 h-4" />
            Send Copy
          </Button>
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'invoice') {
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title="Payment Receipt"
        subtitle={sheet.req.ref}
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F6F8FC] p-4 space-y-2.5 text-[14px]">
            <div className="flex justify-between gap-2">
              <span className="text-[#475569]">Filing</span>
              <span className="font-semibold text-[#0F172A] text-right">{sheet.req.title}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-[#475569]">USDOT</span>
              <span className="font-mono font-semibold text-[#0F172A]">{COMPANY.usdot}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-[#475569]">Status</span>
              <Badge tone="teal">Paid</Badge>
            </div>
            <div className="flex justify-between gap-2 pt-2">
              <span className="font-bold text-[#0F172A]">Total paid</span>
              <span className="font-mono font-bold text-[#0B6B5A]">
                {sheet.req.receiptAmount || '$176.00'}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={() => {
              onClose();
              onShowToast('Receipt saved to Documents');
            }}
          >
            <FileCheck2 className="w-4 h-4" />
            Save Receipt Copy
          </Button>
        </div>
      </InFrameBottomSheet>
    );
  }

  return null;
};

interface VehicleFormBodyProps {
  isEdit: boolean;
  showFleetFields?: boolean;
  initialVehicle?: VehicleItem;
  initialUnitNumber?: string;
  initialStatus?: FleetTruck['status'];
  submitLabel?: string;
  removeLabel?: string;
  onCancel: () => void;
  onSave: (
    vehicle: Omit<VehicleItem, 'id'>,
    editId?: string,
    fleetMeta?: { unitNumber: string; status: FleetTruck['status'] },
  ) => void;
  onRemove?: () => void;
}

const VehicleFormBody: React.FC<VehicleFormBodyProps> = ({
  isEdit,
  showFleetFields = false,
  initialVehicle,
  initialUnitNumber,
  initialStatus,
  submitLabel,
  removeLabel,
  onCancel,
  onSave,
  onRemove,
}) => {
  const [unitNumber, setUnitNumber] = useState(
    isEdit && initialUnitNumber ? initialUnitNumber : 'Unit #107',
  );
  const [status, setStatus] = useState<FleetTruck['status']>(
    isEdit && initialStatus ? initialStatus : 'Insured',
  );
  const [vehName, setVehName] = useState(
    isEdit && initialVehicle ? initialVehicle.name : '2023 Volvo VNL 860',
  );
  const [vehVin, setVehVin] = useState(
    isEdit && initialVehicle ? initialVehicle.vin : '4V4NC9EH7PN603412',
  );
  const [vehOp, setVehOp] = useState<VehicleItem['operationType']>(
    isEdit && initialVehicle ? initialVehicle.operationType : 'OTR',
  );
  const [vehCab, setVehCab] = useState<VehicleItem['cab']>(
    isEdit && initialVehicle ? initialVehicle.cab : 'Sleeper',
  );
  const [vehValue, setVehValue] = useState(
    isEdit && initialVehicle ? initialVehicle.statedValue : '$158,000',
  );
  const [vehRadius, setVehRadius] = useState(
    isEdit && initialVehicle ? initialVehicle.radius : '500+ mi',
  );

  return (
    <div className="space-y-3.5">
      {showFleetFields && (
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[14px] font-semibold text-[#0F172A] mb-1">
              Unit number
            </label>
            <input
              type="text"
              value={unitNumber}
              onChange={(e) => setUnitNumber(e.target.value)}
              className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 text-[16px] font-medium text-[#0F172A] outline-none min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-[14px] font-semibold text-[#0F172A] mb-1">
              Status
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['Insured', 'Pending'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`min-h-[44px] py-2 rounded-xl text-[13px] font-semibold cursor-pointer transition-colors ${
                    status === st
                      ? 'bg-[#0B6B5A] text-white'
                      : 'bg-[#EEF3FB] text-[#334155]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-[14px] font-semibold text-[#0F172A] mb-1">
          Year, make &amp; model
        </label>
        <input
          type="text"
          value={vehName}
          onChange={(e) => setVehName(e.target.value)}
          className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 text-[16px] font-medium text-[#0F172A] outline-none min-h-[44px]"
        />
      </div>

      <div>
        <label className="block text-[14px] font-semibold text-[#0F172A] mb-1">
          17-character VIN
        </label>
        <input
          type="text"
          value={vehVin}
          onChange={(e) => setVehVin(e.target.value.toUpperCase())}
          className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 font-mono text-[16px] font-medium text-[#0F172A] outline-none min-h-[44px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[14px] font-semibold text-[#0F172A] mb-1">Operation</label>
          <div className="grid grid-cols-2 gap-1.5">
            {(['OTR', 'Regional'] as const).map((op) => (
              <button
                key={op}
                type="button"
                onClick={() => setVehOp(op)}
                className={`min-h-[44px] py-2 rounded-xl text-[13px] font-semibold cursor-pointer transition-colors ${
                  vehOp === op
                    ? 'bg-[#0B6B5A] text-white'
                    : 'bg-[#EEF3FB] text-[#334155]'
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[14px] font-semibold text-[#0F172A] mb-1">Cab type</label>
          <div className="grid grid-cols-2 gap-1.5">
            {(['Sleeper', 'Day Cab'] as const).map((cab) => (
              <button
                key={cab}
                type="button"
                onClick={() => setVehCab(cab)}
                className={`min-h-[44px] py-2 rounded-xl text-[13px] font-semibold cursor-pointer transition-colors ${
                  vehCab === cab
                    ? 'bg-[#0F2A3F] text-white'
                    : 'bg-[#EEF3FB] text-[#334155]'
                }`}
              >
                {cab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[14px] font-semibold text-[#0F172A] mb-1">
            Stated value
          </label>
          <input
            type="text"
            value={vehValue}
            onChange={(e) => setVehValue(e.target.value)}
            className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 font-mono text-[16px] font-medium text-[#0F172A] outline-none min-h-[44px]"
          />
        </div>
        <div>
          <label className="block text-[14px] font-semibold text-[#0F172A] mb-1">
            Operating radius
          </label>
          <input
            type="text"
            value={vehRadius}
            onChange={(e) => setVehRadius(e.target.value)}
            className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 text-[16px] font-medium text-[#0F172A] outline-none min-h-[44px]"
          />
        </div>
      </div>

      <div className="pt-1 btn-row-responsive flex gap-2.5">
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          variant="teal"
          onClick={() => {
            if (!vehName.trim() || !vehVin.trim()) return;
            onSave(
              {
                name: vehName.trim(),
                vin: vehVin.trim(),
                operationType: vehOp,
                cab: vehCab,
                statedValue: vehValue.trim() || '$120,000',
                radius: vehRadius.trim() || '500+ mi',
              },
              initialVehicle?.id,
              {
                unitNumber: unitNumber.trim() || 'Unit #107',
                status,
              },
            );
          }}
          className="flex-[1.5]"
        >
          {submitLabel || (isEdit ? 'Save Changes' : 'Add Vehicle')}
        </Button>
      </div>

      {isEdit && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="w-full min-h-[44px] rounded-xl bg-[#FEE2E2]/60 hover:bg-[#FEE2E2] text-[#B91C1C] text-[14px] font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          {removeLabel || 'Remove Vehicle'}
        </button>
      )}
    </div>
  );
};

interface DriverFormBodyProps {
  isEdit: boolean;
  initialDriver?: FleetDriver;
  onCancel: () => void;
  onSave: (driver: Omit<FleetDriver, 'id'>, editId?: string) => void;
  onRemove?: () => void;
}

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'DR';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const DriverFormBody: React.FC<DriverFormBodyProps> = ({
  isEdit,
  initialDriver,
  onCancel,
  onSave,
  onRemove,
}) => {
  const [name, setName] = useState(
    isEdit && initialDriver ? initialDriver.name : 'Jordan Reyes',
  );
  const [cdlNumber, setCdlNumber] = useState(
    isEdit && initialDriver ? initialDriver.cdlNumber : 'CDL-A ••••6240',
  );
  const [cdlState, setCdlState] = useState(
    isEdit && initialDriver ? initialDriver.cdlState : 'TX',
  );
  const [medicalValidUntil, setMedicalValidUntil] = useState(
    isEdit && initialDriver ? initialDriver.medicalValidUntil : 'Oct 15, 2026',
  );
  const [assignedUnit, setAssignedUnit] = useState(
    isEdit && initialDriver ? initialDriver.assignedUnit : 'Unit #105',
  );
  const [phone, setPhone] = useState(
    isEdit && initialDriver ? initialDriver.phone : '(214) 555-0199',
  );
  const [statusLabel, setStatusLabel] = useState(
    isEdit && initialDriver ? initialDriver.statusLabel : 'Active',
  );

  const statusTone: FleetDriver['statusTone'] =
    statusLabel.toLowerCase().includes('expire')
      ? 'red'
      : statusLabel === 'Pending'
        ? 'amber'
        : 'green';

  return (
    <div className="space-y-3.5">
      <div>
        <label className="block text-[14px] font-semibold text-[#0F172A] mb-1">
          Driver name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 text-[16px] font-medium text-[#0F172A] outline-none min-h-[44px]"
        />
      </div>

      <div className="grid grid-cols-[1.5fr_0.8fr] gap-2.5">
        <div>
          <label className="block text-[14px] font-semibold text-[#0F172A] mb-1">
            CDL number
          </label>
          <input
            type="text"
            value={cdlNumber}
            onChange={(e) => setCdlNumber(e.target.value)}
            className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 text-[16px] font-medium text-[#0F172A] outline-none min-h-[44px]"
          />
        </div>
        <div>
          <label className="block text-[14px] font-semibold text-[#0F172A] mb-1">
            State
          </label>
          <input
            type="text"
            value={cdlState}
            onChange={(e) => setCdlState(e.target.value.toUpperCase())}
            className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 text-[16px] font-medium text-[#0F172A] outline-none min-h-[44px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[14px] font-semibold text-[#0F172A] mb-1">
            Medical valid until
          </label>
          <input
            type="text"
            value={medicalValidUntil}
            onChange={(e) => setMedicalValidUntil(e.target.value)}
            className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 text-[16px] font-medium text-[#0F172A] outline-none min-h-[44px]"
          />
        </div>
        <div>
          <label className="block text-[14px] font-semibold text-[#0F172A] mb-1">
            Assigned truck
          </label>
          <input
            type="text"
            value={assignedUnit}
            onChange={(e) => setAssignedUnit(e.target.value)}
            className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 text-[16px] font-medium text-[#0F172A] outline-none min-h-[44px]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[14px] font-semibold text-[#0F172A] mb-1">
          Phone number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 text-[16px] font-medium text-[#0F172A] outline-none min-h-[44px]"
        />
      </div>

      <div>
        <label className="block text-[14px] font-semibold text-[#0F172A] mb-1">
          Status
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['Active', 'Pending', 'Expires in 9 days'] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setStatusLabel(opt)}
              className={`min-h-[44px] px-2 py-2 rounded-xl text-[12px] font-semibold cursor-pointer transition-colors ${
                statusLabel === opt
                  ? 'bg-[#0F2A3F] text-white'
                  : 'bg-[#EEF3FB] text-[#334155]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-1 btn-row-responsive flex gap-2.5">
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          variant="teal"
          onClick={() => {
            if (!name.trim()) return;
            onSave(
              {
                name: name.trim(),
                initials: getInitials(name),
                cdlNumber: cdlNumber.trim() || 'CDL-A ••••0000',
                cdlState: cdlState.trim() || 'TX',
                medicalValidUntil: medicalValidUntil.trim() || 'Dec 31, 2026',
                assignedUnit: assignedUnit.trim() || 'Unassigned',
                phone: phone.trim() || '(214) 555-0100',
                statusLabel,
                statusTone,
              },
              initialDriver?.id,
            );
          }}
          className="flex-[1.5]"
        >
          {isEdit ? 'Save Changes' : 'Add Driver'}
        </Button>
      </div>

      {isEdit && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="w-full min-h-[44px] rounded-xl bg-[#FEE2E2]/60 hover:bg-[#FEE2E2] text-[#B91C1C] text-[14px] font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Remove Driver
        </button>
      )}
    </div>
  );
};

interface UploadDocBodyProps {
  presetTitle?: string;
  onConfirm: (title: string, category: VaultDocument['category'], fileName: string) => void;
}

const UploadDocBody: React.FC<UploadDocBodyProps> = ({ presetTitle, onConfirm }) => {
  const [uploadTitle, setUploadTitle] = useState(
    presetTitle || 'MVR for Marcus Vance',
  );
  const [uploadCat, setUploadCat] = useState<VaultDocument['category']>(
    presetTitle?.toLowerCase().includes('coi') || presetTitle?.toLowerCase().includes('certificate')
      ? 'Insurance'
      : presetTitle?.toLowerCase().includes('cab')
        ? 'Vehicles'
        : 'Permits',
  );
  const [selectedSampleFile, setSelectedSampleFile] = useState(
    presetTitle?.toLowerCase().includes('medical')
      ? 'Marcus_Vance_Medical_Card.pdf'
      : 'Marcus_Vance_MVR_2025.pdf',
  );

  const sampleFiles = [
    'Marcus_Vance_MVR_2025.pdf',
    'Marcus_Vance_Medical_Card.pdf',
    'Unit_105_Cab_Card.pdf',
  ];

  return (
    <div className="space-y-3.5">
      <div>
        <label className="block text-[14px] font-semibold text-[#0F172A] mb-1">
          Document name
        </label>
        <input
          type="text"
          value={uploadTitle}
          onChange={(e) => setUploadTitle(e.target.value)}
          className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 text-[16px] font-medium text-[#0F172A] outline-none min-h-[44px]"
        />
      </div>

      <div>
        <label className="block text-[14px] font-semibold text-[#0F172A] mb-1.5">Category</label>
        <div className="flex flex-wrap gap-2">
          {(['Insurance', 'Vehicles', 'Permits'] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setUploadCat(c)}
              className={`min-h-[44px] rounded-xl px-4 py-2 text-[14px] font-semibold cursor-pointer transition-colors ${
                uploadCat === c
                  ? 'bg-[#0F2A3F] text-white'
                  : 'bg-[#EEF3FB] text-[#334155]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[14px] font-semibold text-[#0F172A] mb-1.5">
          Choose file
        </label>
        <div className="rounded-2xl bg-[#F6F8FC] p-3 space-y-2">
          {sampleFiles.map((file) => {
            const chosen = selectedSampleFile === file;
            return (
              <button
                key={file}
                type="button"
                onClick={() => setSelectedSampleFile(file)}
                className={`w-full min-h-[44px] text-left rounded-xl px-3 py-2 flex items-center justify-between gap-2 text-[13px] font-mono cursor-pointer transition-colors ${
                  chosen
                    ? 'bg-[#D9F2EA] text-[#0B6B5A] font-semibold'
                    : 'bg-white text-[#334155]'
                }`}
              >
                <span className="truncate">{file}</span>
                {chosen && <CheckCircle2 className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <Button
        variant="teal"
        fullWidth
        size="lg"
        onClick={() =>
          onConfirm(uploadTitle.trim() || selectedSampleFile, uploadCat, selectedSampleFile)
        }
      >
        <UploadCloud className="w-4 h-4" />
        Save Document
      </Button>
    </div>
  );
};

const WriteReviewBody: React.FC<{
  onCancel: () => void;
  onSubmit: (rating: number, text: string) => void;
}> = ({ onCancel, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  return (
    <div className="space-y-4">
      <div>
        <span className="block text-[13px] font-medium text-[#0F2A3F] mb-2">
          Your rating
        </span>
        <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => {
            const active = value <= rating;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`}
                onClick={() => setRating(value)}
                className="w-11 h-11 rounded-[12px] bg-[#F8FAFC] hover:bg-[#FEF3C7]/60 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    active ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#CBD5E1] fill-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label
          htmlFor="carrier-review-text"
          className="block text-[13px] font-medium text-[#0F2A3F] mb-1.5"
        >
          How has REVAS helped your fleet?
        </label>
        <textarea
          id="carrier-review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your experience with quotes, filings, or advisor support..."
          rows={4}
          className="w-full min-h-[96px] rounded-[12px] px-3.5 py-2.5 text-[16px] text-[#0F2A3F] placeholder:text-[#94A3B8] bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6B5A]/30 resize-none"
          style={{ border: '0.5px solid #CBD5E1' }}
        />
      </div>

      <div className="flex items-center gap-2.5 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-[44px] rounded-[12px] bg-[#EEF3FB] hover:bg-[#E2E8F0] text-[#0F2A3F] text-[14px] font-medium transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSubmit(rating, text)}
          className="flex-1 h-[44px] rounded-[12px] bg-[#0F2A3F] hover:bg-[#163854] text-white text-[14px] font-medium transition-colors cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
