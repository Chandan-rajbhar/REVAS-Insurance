import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  BadgeCheck,
  FileText,
  Folder,
  MoreVertical,
  Plus,
  Truck,
} from 'lucide-react';
import { type VaultDocument } from '../data/mock';
import { Button, EmptyState } from '../components/ui';

type DocFilter = 'All' | VaultDocument['category'];

const FILTER_CATEGORIES: DocFilter[] = ['All', 'Insurance', 'Vehicles', 'Permits'];

interface DocumentsScreenProps {
  documents: VaultDocument[];
  alertResolved: boolean;
  onOpenUploadSheet: (presetTitle?: string) => void;
  onPreviewDocument: (doc: VaultDocument) => void;
  onOpenDocMenu: (doc: VaultDocument) => void;
}

export const DocumentsScreen: React.FC<DocumentsScreenProps> = ({
  documents,
  alertResolved,
  onOpenUploadSheet,
  onPreviewDocument,
  onOpenDocMenu,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<DocFilter>('All');

  const counts = useMemo(
    () => ({
      All: documents.length,
      Insurance: documents.filter((d) => d.category === 'Insurance').length,
      Vehicles: documents.filter((d) => d.category === 'Vehicles').length,
      Permits: documents.filter((d) => d.category === 'Permits').length,
    }),
    [documents],
  );

  const filteredDocs = useMemo(() => {
    if (selectedFilter === 'All') return documents;
    return documents.filter((d) => d.category === selectedFilter);
  }, [documents, selectedFilter]);

  const renderDocIcon = (doc: VaultDocument) => {
    const toneClass =
      doc.statusTone === 'red'
        ? 'bg-[#FEE2E2] text-[#B91C1C]'
        : doc.category === 'Insurance'
          ? 'bg-[#D9F2EA] text-[#0B6B5A]'
          : 'bg-[#EEF3FB] text-[#0F2A3F]';

    const icon =
      doc.category === 'Insurance' ? (
        <FileText className="w-5 h-5 stroke-[1.9]" />
      ) : doc.category === 'Vehicles' ? (
        <Truck className="w-5 h-5 stroke-[1.9]" />
      ) : (
        <BadgeCheck className="w-5 h-5 stroke-[1.9]" />
      );

    return (
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${toneClass}`}>
        {icon}
      </div>
    );
  };

  return (
    <div className="relative flex-1 min-h-0 w-full flex flex-col">
      <div className="flex-1 min-h-0 scroll-area screen-enter py-4 pb-24 space-y-5">
        {/* Header */}
        <div className="px-4">
          <h1 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
            Documents
          </h1>
        </div>

        {/* Compact Needed Document Banner */}
        {!alertResolved && (
          <div className="px-4">
            <div className="rounded-2xl bg-[#FEE2E2]/70 p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <AlertCircle className="w-5 h-5 text-[#B91C1C] shrink-0 mt-0.5" />
                <span className="text-[14px] font-semibold text-[#B91C1C] leading-snug">
                  1 document needed: MVR for Marcus Vance
                </span>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onOpenUploadSheet('MVR for Marcus Vance')}
                className="shrink-0"
              >
                Upload
              </Button>
            </div>
          </div>
        )}

        {/* Filter Chips */}
        <div className="w-full px-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {FILTER_CATEGORIES.map((cat) => {
            const active = selectedFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                aria-pressed={active}
                className={`shrink-0 min-h-[44px] px-4 rounded-full text-[14px] font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#0F2A3F] text-white'
                    : 'bg-white text-[#334155] shadow-[0_1px_3px_rgba(15,23,42,0.05)] hover:bg-[#EEF3FB]'
                }`}
              >
                <span>{cat}</span>
                <span className={active ? 'text-[#CBD5E1]' : 'text-[#475569]'}>
                  ({counts[cat]})
                </span>
              </button>
            );
          })}
        </div>

        {/* Document Rows */}
        <div className="px-4 space-y-3">
          {filteredDocs.length === 0 ? (
            <EmptyState
              icon={<Folder className="w-6 h-6" />}
              title="No documents here"
              description="No files match this category yet. Upload a document to add it here."
              actionLabel="Upload Document"
              onAction={() => onOpenUploadSheet()}
            />
          ) : (
            filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="w-full bg-white rounded-2xl shadow-[0_1px_4px_rgba(15,23,42,0.05)] p-4 flex items-start justify-between gap-2 transition-colors hover:bg-[#EEF3FB]/35"
              >
                <button
                  type="button"
                  onClick={() => onPreviewDocument(doc)}
                  className="flex-1 min-w-0 flex items-start gap-3 text-left cursor-pointer"
                >
                  {renderDocIcon(doc)}
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-bold text-[#0F172A] leading-snug break-words">
                      {doc.title}
                    </div>
                    <div
                      className={`text-[14px] mt-1 leading-snug flex items-center gap-2 ${
                        doc.statusTone === 'red' ? 'text-[#B91C1C] font-medium' : 'text-[#475569]'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          doc.statusTone === 'red' ? 'bg-[#B91C1C]' : 'bg-[#0B6B5A]'
                        }`}
                      />
                      <span>{doc.metaLine}</span>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenDocMenu(doc)}
                  aria-label={`More actions for ${doc.title}`}
                  className="w-11 h-11 -mr-2 -mt-1 rounded-full flex items-center justify-center text-[#475569] hover:bg-[#EEF3FB] hover:text-[#0F172A] shrink-0 cursor-pointer transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Upload Button */}
      <button
        type="button"
        onClick={() => onOpenUploadSheet()}
        className="absolute bottom-4 right-4 z-20 min-h-[48px] px-4 rounded-full bg-[#0F2A3F] hover:bg-[#0B1726] text-white text-[14px] font-semibold shadow-[0_8px_20px_rgba(15,42,63,0.28)] inline-flex items-center gap-2 cursor-pointer active:scale-[0.98] transition-all"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Upload Document</span>
      </button>
    </div>
  );
};
