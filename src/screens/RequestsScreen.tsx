import React, { useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Download,
  Receipt,
  UploadCloud,
} from 'lucide-react';
import { ADVISOR, type RequestItem, type UiState } from '../data/mock';
import { useScrollPersistence } from '../hooks';
import { formatRelativeTime } from '../lib/dates';
import { Badge, Button, Card, EmptyState, StepTracker } from '../components/ui';

type RequestFilter = UiState['requestsFilter'];

interface RequestsScreenProps {
  requests: RequestItem[];
  activeFilter: RequestFilter;
  expandedMap: Record<string, boolean>;
  onFilterChange: (filter: RequestFilter) => void;
  onToggleExpand: (id: string) => void;
  onProvideInfo: (requestId: string) => void;
  onMessageSarah: () => void;
  onViewInvoice: (req: RequestItem) => void;
  onDownloadNotice: (req: RequestItem) => void;
}

export const RequestsScreen: React.FC<RequestsScreenProps> = ({
  requests,
  activeFilter,
  expandedMap,
  onFilterChange,
  onToggleExpand,
  onProvideInfo,
  onMessageSarah,
  onViewInvoice,
  onDownloadNotice,
}) => {
  const { scrollRef, onScroll } = useScrollPersistence('requests');

  const counts = useMemo(
    () => ({
      all: requests.length,
      in_progress: requests.filter((r) => r.filterTags.includes('in_progress')).length,
      action_needed: requests.filter((r) => r.filterTags.includes('action_needed')).length,
      cleared: requests.filter((r) => r.filterTags.includes('cleared')).length,
    }),
    [requests],
  );

  const filteredRequests = useMemo(() => {
    if (activeFilter === 'all') return requests;
    return requests.filter((r) => r.filterTags.includes(activeFilter));
  }, [requests, activeFilter]);

  const isExpanded = (req: RequestItem) => {
    if (req.id in expandedMap) return expandedMap[req.id];
    return Boolean(req.actionNeeded);
  };

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="flex-1 min-h-0 scroll-area screen-enter py-4 space-y-5"
    >
      {/* Header */}
      <div className="px-4">
        <h1 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
          Requests
        </h1>
      </div>

      {/* Filter Chips */}
      <div className="w-full px-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {(
          [
            { id: 'all', label: 'All', count: counts.all },
            { id: 'in_progress', label: 'In Progress', count: counts.in_progress },
            {
              id: 'action_needed',
              label: 'Action Needed',
              count: counts.action_needed,
              redDot: counts.action_needed > 0,
            },
            { id: 'cleared', label: 'Cleared', count: counts.cleared },
          ] as const
        ).map((chip) => {
          const active = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onFilterChange(chip.id)}
              aria-pressed={active}
              className={`shrink-0 min-h-[44px] px-4 rounded-full text-[14px] font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-[#0F2A3F] text-white'
                  : 'bg-white text-[#334155] shadow-[0_1px_3px_rgba(15,23,42,0.05)] hover:bg-[#EEF3FB]'
              }`}
            >
              {'redDot' in chip && chip.redDot && (
                <span
                  aria-hidden="true"
                  className={`w-2 h-2 rounded-full ${active ? 'bg-[#FEE2E2]' : 'bg-[#B91C1C]'}`}
                />
              )}
              <span>{chip.label}</span>
              <span className={active ? 'text-[#CBD5E1]' : 'text-[#475569]'}>
                ({chip.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      <div className="px-4 space-y-3">
        {filteredRequests.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="w-6 h-6" />}
            title="No requests here"
            description="No filings or quotes match this filter right now."
            actionLabel="Show all requests"
            onAction={() => onFilterChange('all')}
          />
        ) : (
          filteredRequests.map((req) => {
            const expanded = isExpanded(req);
            return (
              <Card key={req.id} padding="none" className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => onToggleExpand(req.id)}
                  aria-expanded={expanded}
                  className="w-full min-h-[68px] p-4 flex items-center justify-between gap-3 text-left hover:bg-[#EEF3FB]/35 transition-colors cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-[16px] font-bold text-[#0F172A] leading-snug">
                        {req.title}
                      </h2>
                    </div>
                    <p className="text-[14px] text-[#475569] mt-0.5 truncate">
                      {req.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge tone={req.statusTone}>{req.statusLabel}</Badge>
                    {expanded ? (
                      <ChevronUp className="w-4 h-4 text-[#475569]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#475569]" />
                    )}
                  </div>
                </button>

                {expanded && (
                  <div className="px-4 pb-4 pt-1 space-y-4">
                    <div className="flex items-center justify-between gap-2 text-[13px] text-[#475569]">
                      <span className="font-mono">{req.ref}</span>
                      <span>
                        {req.stepProgress
                          ? `${req.stepProgress} • ${formatRelativeTime(req.createdAt)}`
                          : formatRelativeTime(req.createdAt)}
                      </span>
                    </div>

                    {req.stepper && <StepTracker steps={req.stepper.steps} />}

                    {req.advisorNote && (
                      <div className="rounded-2xl bg-[#F6F8FC] p-3.5 space-y-1">
                        <div className="text-[13px] font-bold text-[#0F172A]">
                          {ADVISOR.name}
                        </div>
                        <p className="text-[14px] text-[#334155] leading-relaxed">
                          {req.advisorNote}
                        </p>
                      </div>
                    )}

                    {req.timeline && req.timeline.length > 0 && (
                      <div className="space-y-1.5 border-l-2 border-[#D9F2EA] pl-3">
                        {req.timeline.map((item) => (
                          <div key={item.id} className="text-[12px] text-[#475569] flex items-center justify-between gap-2">
                            <span className="font-medium text-[#0F2A3F] truncate">{item.label}</span>
                            <span className="shrink-0 text-[#64748B]">{formatRelativeTime(item.at)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {req.actionNeeded && (
                      <div className="btn-row-responsive flex items-center gap-3">
                        <Button
                          variant="teal"
                          size="md"
                          onClick={() => onProvideInfo(req.id)}
                          className="flex-1"
                        >
                          <UploadCloud className="w-4 h-4" />
                          Provide Info
                        </Button>
                        <button
                          type="button"
                          onClick={onMessageSarah}
                          className="min-h-[44px] px-3 text-[14px] font-semibold text-[#0F172A] hover:underline cursor-pointer shrink-0"
                        >
                          Message Sarah
                        </button>
                      </div>
                    )}

                    {req.receiptAmount && (
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <span className="text-[14px] text-[#475569]">
                          Paid: <strong className="text-[#0F172A]">{req.receiptAmount}</strong>
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onViewInvoice(req)}
                        >
                          <Receipt className="w-4 h-4" />
                          View Receipt
                        </Button>
                      </div>
                    )}

                    {req.downloadNotice && (
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <span className="text-[14px] text-[#475569] truncate">
                          {req.downloadNotice}
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onDownloadNotice(req)}
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
