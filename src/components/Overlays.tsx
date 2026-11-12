import React, { useRef, useState } from 'react';
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
  RotateCcw,
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
  HOME_IMAGES,
  type ChatMessage,
  type CompanyInfo,
  type FleetDriver,
  type FleetTruck,
  type PolicyItem,
  type QuoteDraft,
  type RequestItem,
  type ServiceItem,
  type VaultDocument,
  type VehicleItem,
} from '../data/mock';
import {
  formatClockTime,
  formatExpiryCountdown,
  formatRelativeTime,
  formatShortDate,
  getDaysUntil,
} from '../lib/dates';
import { formatFileSize, prepareUploadedFile, type PreparedUploadFile } from '../lib/files';
import type { UploadDocumentPayload } from '../hooks/useDocuments';
import type { ActiveSheet } from '../store/reducer';
import { Badge, Button, InFrameBottomSheet, ResponsivePhoto } from './ui';

export type { ActiveSheet };

interface OverlaysProps {
  sheet: ActiveSheet;
  company: CompanyInfo;
  policies: PolicyItem[];
  requests: RequestItem[];
  documents: VaultDocument[];
  trucks: FleetTruck[];
  drivers: FleetDriver[];
  quote: QuoteDraft | null;
  chatMessages: ChatMessage[];
  onClose: () => void;
  onOpenSheet: (sheet: ActiveSheet) => void;
  onSaveVehicle: (vehicle: Omit<VehicleItem, 'id'>, editId?: string) => void;
  onRemoveVehicle: (vehicle: VehicleItem) => void;
  onSaveFleetTruck: (truck: Omit<FleetTruck, 'id'>, editId?: string) => void;
  onRemoveFleetTruck: (truck: FleetTruck) => void;
  onSaveFleetDriver: (driver: Omit<FleetDriver, 'id'>, editId?: string) => void;
  onRemoveFleetDriver: (driver: FleetDriver) => void;
  onConfirmService: (service: ServiceItem) => void;
  onConfirmUploadDoc: (payload: UploadDocumentPayload) => void;
  onDeleteDocument: (doc: VaultDocument) => void;
  onRecordDocActivity: (docId: string, text: string, toastMessage?: string) => void;
  onSubmitReview: (rating: number, text: string) => void;
  onSendChatMessage: (text: string) => void;
  onSaveCompany: (patch: Partial<CompanyInfo>) => void;
  onResetDemoData: () => void;
  onCloseTutorial: () => void;
  onShowToast: (message: string) => void;
}

export const Overlays: React.FC<OverlaysProps> = ({
  sheet,
  company,
  policies,
  requests,
  documents,
  trucks,
  drivers,
  quote,
  chatMessages,
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
  onDeleteDocument,
  onRecordDocActivity,
  onSubmitReview,
  onSendChatMessage,
  onSaveCompany,
  onResetDemoData,
  onCloseTutorial,
  onShowToast,
}) => {
  const [chatInput, setChatInput] = useState('');
  const [shipperEmail, setShipperEmail] = useState('compliance@chrobinson.com');
  const [shipperError, setShipperError] = useState('');

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
        subtitle={company.name}
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F6F8FC] p-4 space-y-2">
            <div className="text-[15px] font-bold text-[#0F172A]">Document &amp; data security</div>
            <p className="text-[14px] text-[#475569] leading-relaxed">
              Fleet certificates, driver credentials, and vehicle schedules are persisted locally
              under schema version revas:v1 and never sent to third-party servers.
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
      onSendChatMessage(trimmed);
      setChatInput('');
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
            {chatMessages.map((m) => (
              <div
                key={m.id}
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
                <span className="text-[12px] text-[#475569] mt-1 px-1">
                  {formatClockTime(m.createdAt)}
                </span>
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
        subtitle={`${policies.length} active • ${company.name}`}
      >
        <div className="space-y-2.5">
          {policies.map((policy) => (
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
      ...requests.filter((r) => Boolean(r.receiptAmount)),
      {
        id: 'inv-pol-auto',
        ref: 'INV-PRG-99042',
        createdAt: '2024-11-30T12:00:00.000Z',
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
        createdAt: '2024-11-30T12:00:00.000Z',
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
                  {inv.ref} · {formatShortDate(inv.createdAt)}
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
    const t = trucks.find((item) => item.id === sheet.truck.id) ?? sheet.truck;
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
        subtitle={company.name}
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
                  onRemoveFleetTruck(target);
                }
              : undefined
          }
        />
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'fleet-driver-details') {
    const d = drivers.find((item) => item.id === sheet.driver.id) ?? sheet.driver;
    const days = getDaysUntil(d.medicalExpiryIso);
    const isUrgent = days !== null && days <= 14;
    const isWarn = days !== null && days > 14 && days <= 30;
    const statusLabel =
      days !== null && days <= 30 ? formatExpiryCountdown(d.medicalExpiryIso) : 'Active';
    const badgeClass = isUrgent
      ? 'bg-[#FDE9E9] text-[#B91C1C]'
      : isWarn
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
                  {statusLabel}
                </span>
              </div>
            </div>
            <div>
              <div className="text-[12px] font-medium text-[#475569]">Medical card expires</div>
              <div className="text-[14px] font-semibold text-[#0F172A] mt-0.5">
                {formatShortDate(d.medicalExpiryIso)}
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

          {(isUrgent || isWarn) && (
            <Button
              variant="secondary"
              fullWidth
              size="md"
              onClick={() =>
                onOpenSheet({
                  type: 'upload-doc',
                  presetTitle: `DOT Medical Card — ${d.name}`,
                  presetCategory: 'Permits',
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
        subtitle={company.name}
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
        subtitle={company.name}
      >
        <WriteReviewBody onCancel={onClose} onSubmit={onSubmitReview} />
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'policy-details') {
    const p = policies.find((item) => item.id === sheet.policy.id) ?? sheet.policy;
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
              <div className="text-[14px] font-semibold text-[#0F172A] mt-0.5">
                {p.unitsCovered}
              </div>
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
        subtitle={`${p.policyNumber} • ${company.name}`}
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F6F8FC] p-4 space-y-2.5 text-[14px] text-[#334155]">
            <div className="flex items-center justify-between gap-2 pb-2">
              <span className="font-bold text-[#0F172A]">{p.name}</span>
              <Badge tone="teal">Active</Badge>
            </div>
            <div>
              <span className="text-[#475569]">Carrier:</span> {company.name}
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
                onShowToast(`Certificate emailed to ${company.email}`);
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
    const currentStep = quote?.currentStep ?? 3;
    const totalSteps = quote?.totalSteps ?? 6;
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title={isEdit ? 'Edit Vehicle' : 'Add Vehicle'}
        subtitle={`Fleet Policy Quote • Step ${currentStep} of ${totalSteps}`}
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
            <p className="text-[14px] text-[#334155] leading-relaxed">{s.description}</p>
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
        subtitle={company.name}
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F6F8FC] p-4 space-y-2.5 text-[14px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#475569]">Company</span>
              <span className="font-semibold text-[#0F172A]">{company.name}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#475569]">Authority</span>
              <span className="font-mono font-semibold text-[#0F172A]">
                USDOT {company.usdot}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-2">
              <span className="text-[#475569]">Price</span>
              <span className="text-[16px] font-bold text-[#0B6B5A]">{s.price}</span>
            </div>
          </div>

          <p className="text-[14px] text-[#475569] leading-relaxed">
            This submits a filing request to {ADVISOR.name} and adds it to your Requests list and
            invoice history.
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
        subtitle="Select category and upload file"
      >
        <UploadDocBody
          key={`${sheet.presetTitle || 'default'}-${sheet.forMvrRequestId || 'none'}`}
          presetTitle={sheet.presetTitle}
          presetCategory={sheet.presetCategory}
          forMvrRequestId={sheet.forMvrRequestId}
          onConfirm={onConfirmUploadDoc}
        />
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'doc-preview') {
    const doc = documents.find((item) => item.id === sheet.doc.id) ?? sheet.doc;
    const isImageData = Boolean(doc.dataUrl && doc.dataUrl.startsWith('data:image/'));
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title={doc.title}
        subtitle={`${doc.category} • ${formatShortDate(doc.createdAt)}`}
      >
        <div className="space-y-4">
          {isImageData && doc.dataUrl && (
            <div className="rounded-2xl overflow-hidden bg-[#F6F8FC] border border-[#E1E5EC]">
              <img
                src={doc.dataUrl}
                alt={doc.fileName || doc.title}
                className="w-full max-h-[220px] object-contain mx-auto"
              />
            </div>
          )}

          {doc.previewOmitted && (
            <div className="rounded-2xl bg-[#EEF3FB] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#0F2A3F] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-[#0F2A3F] truncate">
                  {doc.fileName || 'Attached file'}
                </div>
                <div className="text-[12px] text-[#475569]">
                  {doc.fileSize ? formatFileSize(doc.fileSize) : 'Large file'} • Metadata stored
                  locally (&gt;300KB preview omitted)
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-[#F6F8FC] p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-[#0B6B5A] shrink-0" />
                <span className="text-[14px] font-semibold text-[#0F172A] truncate">
                  {company.name}
                </span>
              </div>
              <Badge tone={doc.statusTone}>
                {doc.statusTone === 'red' ? 'Expiring soon' : 'Active'}
              </Badge>
            </div>
            <p className="text-[14px] text-[#334155] leading-relaxed">{doc.previewSummary}</p>

            {doc.activities && doc.activities.length > 0 && (
              <div className="pt-2 border-t border-[#E1E5EC] space-y-1">
                <div className="text-[12px] font-semibold text-[#475569]">Activity log</div>
                {doc.activities.slice(0, 3).map((act) => (
                  <div key={act.id} className="text-[12px] text-[#334155] flex justify-between gap-2">
                    <span className="truncate">{act.text}</span>
                    <span className="text-[#64748B] shrink-0">
                      {formatRelativeTime(act.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
              onClick={() =>
                onRecordDocActivity(
                  doc.id,
                  'Share link copied',
                  `Share link copied for ${doc.title}`,
                )
              }
            >
              <Share2 className="w-4 h-4" />
              Share Link
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                onOpenSheet({
                  type: 'upload-doc',
                  presetTitle: doc.title,
                  presetCategory: doc.category,
                })
              }
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
    const doc = documents.find((item) => item.id === sheet.doc.id) ?? sheet.doc;
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
            onClick={() =>
              onRecordDocActivity(
                doc.id,
                'Share link copied',
                `Share link copied for ${doc.title}`,
              )
            }
          >
            Copy Share Link
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() =>
              onOpenSheet({
                type: 'upload-doc',
                presetTitle: doc.title,
                presetCategory: doc.category,
              })
            }
          >
            Replace Document
          </Button>
          <button
            type="button"
            onClick={() => onDeleteDocument(doc)}
            className="w-full min-h-[44px] rounded-xl bg-[#FEE2E2]/70 hover:bg-[#FEE2E2] text-[#B91C1C] text-[14px] font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Remove Document
          </button>
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'send-shipper') {
    const handleSendShipper = () => {
      const trimmed = shipperEmail.trim();
      if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        setShipperError('Enter a valid recipient email address.');
        return;
      }
      setShipperError('');
      onRecordDocActivity(
        sheet.doc.id,
        `Sent to ${trimmed}`,
        `Sent document to ${trimmed}`,
      );
    };

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
              onChange={(e) => {
                setShipperEmail(e.target.value);
                if (shipperError) setShipperError('');
              }}
              className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 text-[16px] text-[#0F172A] outline-none min-h-[44px]"
            />
            {shipperError && (
              <p className="mt-1.5 text-[12px] font-medium text-[#DC2626]" role="alert">
                {shipperError}
              </p>
            )}
          </div>
          <Button variant="primary" fullWidth size="lg" onClick={handleSendShipper}>
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
              <span className="font-mono font-semibold text-[#0F172A]">{company.usdot}</span>
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
              onConfirmUploadDoc({
                title: `Receipt — ${sheet.req.title} (${sheet.req.ref})`,
                category: 'Permits',
                previewSummary: `Payment receipt for ${sheet.req.title} (${sheet.req.receiptAmount || '$176.00 Paid'}).`,
                fileTypeLabel: 'PDF',
              });
            }}
          >
            <FileCheck2 className="w-4 h-4" />
            Save Receipt Copy
          </Button>
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'company-edit') {
    return (
      <CompanyEditBody
        key={company.usdot}
        company={company}
        onCancel={onClose}
        onSave={onSaveCompany}
      />
    );
  }

  if (sheet.type === 'reset-demo-confirm') {
    return (
      <InFrameBottomSheet
        open
        onClose={onClose}
        title="Reset demo data?"
        subtitle={company.name}
      >
        <div className="space-y-4">
          <p className="text-[14px] text-[#334155] leading-relaxed">
            This clears all locally saved trucks, drivers, uploaded files, requests, reviews, and
            messages, restoring the original Apex Hauling LLC demo dataset.
          </p>
          <div className="btn-row-responsive grid grid-cols-2 gap-2.5">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onClose();
                onResetDemoData();
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Reset All Data
            </Button>
          </div>
        </div>
      </InFrameBottomSheet>
    );
  }

  if (sheet.type === 'tutorial') {
    return (
      <InFrameBottomSheet
        open
        onClose={onCloseTutorial}
        title="REVAS Carrier Portal Guide"
        subtitle="Quick walkthrough"
      >
        <div className="space-y-3 text-[14px] text-[#334155]">
          <div className="rounded-2xl bg-[#F6F8FC] p-3.5">
            <div className="font-semibold text-[#0F2A3F]">1. Home &amp; Compliance Alerts</div>
            <p className="text-[13px] text-[#475569] mt-0.5">
              Upload expiring medical cards or send one-tap reminders to drivers.
            </p>
          </div>
          <div className="rounded-2xl bg-[#F6F8FC] p-3.5">
            <div className="font-semibold text-[#0F2A3F]">2. Document Vault &amp; Requests</div>
            <p className="text-[13px] text-[#475569] mt-0.5">
              Upload real files, track MVRs and UCR filings, and share certificates directly with
              shippers.
            </p>
          </div>
          <div className="rounded-2xl bg-[#F6F8FC] p-3.5">
            <div className="font-semibold text-[#0F2A3F]">3. Offline-Ready Local Storage</div>
            <p className="text-[13px] text-[#475569] mt-0.5">
              Every quote step, truck, driver, review, and message saves automatically across page
              refreshes and browser tabs.
            </p>
          </div>
          <Button variant="primary" fullWidth onClick={onCloseTutorial}>
            Got it
          </Button>
        </div>
      </InFrameBottomSheet>
    );
  }

  return null;
};

interface CompanyEditBodyProps {
  company: CompanyInfo;
  onCancel: () => void;
  onSave: (patch: Partial<CompanyInfo>) => void;
}

const CompanyEditBody: React.FC<CompanyEditBodyProps> = ({ company, onCancel, onSave }) => {
  const [name, setName] = useState(company.name);
  const [usdot, setUsdot] = useState(company.usdot);
  const [mc, setMc] = useState(company.mc);
  const [address, setAddress] = useState(company.address);
  const [email, setEmail] = useState(company.email);
  const [phone, setPhone] = useState(company.phone);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const cleanName = name.trim();
    const cleanUsdot = usdot.replace(/\D/g, '');
    const cleanMc = mc.trim().toUpperCase();
    const cleanAddress = address.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setError('Company name is required.');
      return;
    }
    if (cleanUsdot.length < 5 || cleanUsdot.length > 8) {
      setError('Enter a valid 5–8 digit USDOT number.');
      return;
    }
    if (!/^MC-?\d{4,7}$/.test(cleanMc)) {
      setError('Enter MC number like MC-145290.');
      return;
    }
    if (!cleanAddress) {
      setError('Principal address is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Enter a valid email address.');
      return;
    }
    if (cleanPhone.replace(/\D/g, '').length < 10) {
      setError('Enter a valid 10-digit phone number.');
      return;
    }

    setError('');
    onSave({
      name: cleanName,
      usdot: cleanUsdot,
      mc: cleanMc.startsWith('MC-') ? cleanMc : `MC-${cleanMc.replace(/^MC/, '')}`,
      address: cleanAddress,
      email: cleanEmail,
      phone: cleanPhone,
    });
  };

  return (
    <InFrameBottomSheet open onClose={onCancel} title="Edit Company Details" subtitle={company.name}>
      <div className="space-y-3.5">
        {error && (
          <div className="rounded-xl bg-[#FEE2E2] px-3 py-2 text-[12px] font-medium text-[#B91C1C]" role="alert">
            {error}
          </div>
        )}
        <div>
          <label className="block text-[13px] font-semibold text-[#0F172A] mb-1">Company name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 text-[15px] text-[#0F172A] outline-none min-h-[44px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-1">USDOT</label>
            <input
              type="text"
              inputMode="numeric"
              value={usdot}
              onChange={(e) => setUsdot(e.target.value)}
              className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 font-mono text-[15px] text-[#0F172A] outline-none min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-1">MC Number</label>
            <input
              type="text"
              value={mc}
              onChange={(e) => setMc(e.target.value)}
              className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 font-mono text-[15px] text-[#0F172A] outline-none min-h-[44px]"
            />
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[#0F172A] mb-1">Principal address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 text-[15px] text-[#0F172A] outline-none min-h-[44px]"
          />
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-1">Dispatch email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 text-[15px] text-[#0F172A] outline-none min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-1">Primary phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3.5 py-2.5 font-mono text-[15px] text-[#0F172A] outline-none min-h-[44px]"
            />
          </div>
        </div>
        <div className="pt-1 btn-row-responsive flex gap-2.5">
          <Button variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button variant="teal" onClick={handleSubmit} className="flex-[1.5]">
            Save Details
          </Button>
        </div>
      </div>
    </InFrameBottomSheet>
  );
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
  const [error, setError] = useState('');

  const handleSave = () => {
    const cleanName = vehName.trim();
    const cleanVin = vehVin.trim().toUpperCase();
    const numericVal = Number(vehValue.replace(/[^0-9.]/g, ''));

    if (!cleanName) {
      setError('Year, make & model is required.');
      return;
    }
    if (showFleetFields && !unitNumber.trim()) {
      setError('Unit number is required.');
      return;
    }
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(cleanVin)) {
      setError('VIN must be 17 alphanumeric characters (excluding I, O, Q).');
      return;
    }
    if (!Number.isFinite(numericVal) || numericVal <= 0) {
      setError('Enter a positive stated value (e.g. $158,000).');
      return;
    }

    setError('');
    const formattedVal = `$${Math.round(numericVal).toLocaleString('en-US')}`;
    onSave(
      {
        name: cleanName,
        vin: cleanVin,
        operationType: vehOp,
        cab: vehCab,
        statedValue: formattedVal,
        radius: vehRadius.trim() || '500+ mi',
      },
      initialVehicle?.id,
      {
        unitNumber: unitNumber.trim() || 'Unit #107',
        status,
      },
    );
  };

  return (
    <div className="space-y-3.5">
      {error && (
        <div className="rounded-xl bg-[#FEE2E2] px-3 py-2 text-[12px] font-medium text-[#B91C1C]" role="alert">
          {error}
        </div>
      )}

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
          maxLength={17}
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
        <Button variant="teal" onClick={handleSave} className="flex-[1.5]">
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

const getInitials = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase() || 'DR';
  return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase();
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
  const [medicalDate, setMedicalDate] = useState(() =>
    isEdit && initialDriver
      ? initialDriver.medicalExpiryIso.slice(0, 10)
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  );
  const [assignedUnit, setAssignedUnit] = useState(
    isEdit && initialDriver ? initialDriver.assignedUnit : 'Unit #105',
  );
  const [phone, setPhone] = useState(
    isEdit && initialDriver ? initialDriver.phone : '(214) 555-0199',
  );
  const [error, setError] = useState('');

  const handleSave = () => {
    const cleanName = name.trim();
    const cleanCdl = cdlNumber.trim();
    const cleanState = cdlState.trim().toUpperCase();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setError('Driver full name is required.');
      return;
    }
    if (cleanCdl.length < 4) {
      setError('Enter a valid CDL number.');
      return;
    }
    if (!/^[A-Z]{2}$/.test(cleanState)) {
      setError('Enter a 2-letter CDL issuing state (e.g. TX).');
      return;
    }
    if (!medicalDate || Number.isNaN(Date.parse(`${medicalDate}T12:00:00Z`))) {
      setError('Choose a valid medical card expiration date.');
      return;
    }
    if (cleanPhone.replace(/\D/g, '').length < 10) {
      setError('Enter a valid 10-digit driver phone number.');
      return;
    }

    const medicalExpiryIso = new Date(`${medicalDate}T12:00:00Z`).toISOString();
    const days = getDaysUntil(medicalExpiryIso);
    const statusTone: FleetDriver['statusTone'] =
      days !== null && days <= 14 ? 'red' : days !== null && days <= 30 ? 'amber' : 'green';

    setError('');
    onSave(
      {
        name: cleanName,
        initials: getInitials(cleanName),
        cdlNumber: cleanCdl,
        cdlState: cleanState,
        medicalExpiryIso,
        assignedUnit: assignedUnit.trim() || 'Unassigned',
        phone: cleanPhone,
        statusTone,
      },
      initialDriver?.id,
    );
  };

  return (
    <div className="space-y-3.5">
      {error && (
        <div className="rounded-xl bg-[#FEE2E2] px-3 py-2 text-[12px] font-medium text-[#B91C1C]" role="alert">
          {error}
        </div>
      )}

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
            maxLength={2}
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
            type="date"
            value={medicalDate}
            onChange={(e) => setMedicalDate(e.target.value)}
            className="w-full bg-[#F6F8FC] border border-[#CBD5E1] focus:border-[#0B6B5A] rounded-xl px-3 py-2.5 text-[14px] font-medium text-[#0F172A] outline-none min-h-[44px]"
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

      <div className="pt-1 btn-row-responsive flex gap-2.5">
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button variant="teal" onClick={handleSave} className="flex-[1.5]">
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
  presetCategory?: VaultDocument['category'];
  forMvrRequestId?: string;
  onConfirm: (payload: UploadDocumentPayload) => void;
}

const UploadDocBody: React.FC<UploadDocBodyProps> = ({
  presetTitle,
  presetCategory,
  forMvrRequestId,
  onConfirm,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadTitle, setUploadTitle] = useState(
    presetTitle || 'Driver Motor Vehicle Record (MVR)',
  );
  const [uploadCat, setUploadCat] = useState<VaultDocument['category']>(
    presetCategory ||
      (presetTitle?.toLowerCase().includes('certificate')
        ? 'Insurance'
        : presetTitle?.toLowerCase().includes('cab')
          ? 'Vehicles'
          : 'Permits'),
  );
  const [preparedFile, setPreparedFile] = useState<PreparedUploadFile | null>(null);
  const [processingFile, setProcessingFile] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessingFile(true);
    setError('');
    try {
      const prepared = await prepareUploadedFile(file);
      setPreparedFile(prepared);
      if (!presetTitle && !uploadTitle.trim()) {
        setUploadTitle(file.name.replace(/\.[^.]+$/, ''));
      }
    } finally {
      setProcessingFile(false);
    }
  };

  const handleSave = () => {
    const cleanTitle = uploadTitle.trim();
    if (!cleanTitle) {
      setError('Document name is required.');
      return;
    }

    const fileTypeLabel = preparedFile?.type.startsWith('image/')
      ? 'Image'
      : preparedFile?.name.toLowerCase().endsWith('.pdf') || !preparedFile
        ? 'PDF'
        : 'File';

    const resolvesMedical = cleanTitle.toLowerCase().includes('medical');

    onConfirm({
      title: cleanTitle,
      category: uploadCat,
      previewSummary: preparedFile
        ? `Uploaded ${preparedFile.name} (${formatFileSize(preparedFile.size)}) under ${uploadCat}.`
        : `Uploaded ${cleanTitle} under ${uploadCat}.`,
      fileTypeLabel,
      fileName: preparedFile?.name,
      fileType: preparedFile?.type,
      fileSize: preparedFile?.size,
      dataUrl: preparedFile?.dataUrl,
      previewOmitted: preparedFile?.previewOmitted,
      resolvesMedicalAlert: resolvesMedical,
      mvrRequestId: forMvrRequestId,
    });
  };

  return (
    <div className="space-y-3.5">
      {error && (
        <div className="rounded-xl bg-[#FEE2E2] px-3 py-2 text-[12px] font-medium text-[#B91C1C]" role="alert">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[14px] font-semibold text-[#0F172A] mb-1">
          Document name
        </label>
        <input
          type="text"
          value={uploadTitle}
          onChange={(e) => {
            setUploadTitle(e.target.value);
            if (error) setError('');
          }}
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
          Attach file
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          aria-label="Upload document file"
          className="sr-only"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full min-h-[60px] rounded-2xl border border-dashed border-[#0B6B5A] bg-[#F6F8FC] hover:bg-[#D9F2EA]/40 px-4 py-3 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors"
        >
          <div className="min-w-0">
            <div className="text-[14px] font-semibold text-[#0F2A3F] truncate">
              {processingFile
                ? 'Preparing file...'
                : preparedFile
                  ? preparedFile.name
                  : 'Choose PDF or photo from device'}
            </div>
            <div className="text-[12px] text-[#475569] mt-0.5">
              {preparedFile
                ? `${formatFileSize(preparedFile.size)} • ${
                    preparedFile.previewOmitted
                      ? 'Metadata only (>300KB)'
                      : 'Saved inline for preview'
                  }`
                : 'Images resized cleanly under 300KB; larger files keep metadata'}
            </div>
          </div>
          {preparedFile ? (
            <CheckCircle2 className="w-5 h-5 text-[#0B6B5A] shrink-0" />
          ) : (
            <UploadCloud className="w-5 h-5 text-[#0B6B5A] shrink-0" />
          )}
        </button>
      </div>

      <Button
        variant="teal"
        fullWidth
        size="lg"
        disabled={processingFile}
        onClick={handleSave}
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
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed.length < 3) {
      setError('Please write a short review before submitting.');
      return;
    }
    setError('');
    onSubmit(rating, trimmed);
  };

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
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError('');
          }}
          placeholder="Share your experience with quotes, filings, or advisor support..."
          rows={4}
          className="w-full min-h-[96px] rounded-[12px] px-3.5 py-2.5 text-[16px] text-[#0F2A3F] placeholder:text-[#94A3B8] bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6B5A]/30 resize-none"
          style={{ border: error ? '1px solid #DC2626' : '0.5px solid #CBD5E1' }}
        />
        {error && (
          <p className="mt-1 text-[12px] font-medium text-[#DC2626]" role="alert">
            {error}
          </p>
        )}
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
          onClick={handleSubmit}
          className="flex-1 h-[44px] rounded-[12px] bg-[#0F2A3F] hover:bg-[#163854] text-white text-[14px] font-medium transition-colors cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
