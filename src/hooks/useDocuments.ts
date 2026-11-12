import { useCallback, useMemo } from 'react';
import type { VaultDocument } from '../data/mock';
import { nowIso } from '../lib/dates';
import { newId, useAppStore } from '../store/context';

export interface UploadDocumentPayload {
  title: string;
  category: VaultDocument['category'];
  previewSummary: string;
  fileTypeLabel?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  dataUrl?: string;
  previewOmitted?: boolean;
  resolvesMedicalAlert?: boolean;
  mvrRequestId?: string;
}

export function useDocuments() {
  const { state, dispatch, showToast, scheduleDeleteWithUndo } = useAppStore();

  const categoryCounts = useMemo(() => {
    const counts = {
      All: state.documents.length,
      Insurance: 0,
      Vehicles: 0,
      Permits: 0,
    };
    for (const doc of state.documents) {
      counts[doc.category] += 1;
    }
    return counts;
  }, [state.documents]);

  const uploadDocument = useCallback(
    (payload: UploadDocumentPayload) => {
      const timestampIso = nowIso();
      const label = payload.fileTypeLabel || 'File';
      const doc: VaultDocument = {
        id: newId(),
        category: payload.category,
        metaLine: `${label} • Uploaded today`,
        statusTone: 'teal',
        title: payload.title.trim(),
        previewSummary: payload.previewSummary.trim(),
        createdAt: timestampIso,
        fileTypeLabel: label,
        fileName: payload.fileName,
        fileType: payload.fileType,
        fileSize: payload.fileSize,
        dataUrl: payload.dataUrl,
        previewOmitted: payload.previewOmitted,
        activities: [
          {
            id: newId(),
            text: payload.fileName
              ? `Uploaded ${payload.fileName}`
              : 'Uploaded to Document Vault',
            createdAt: timestampIso,
          },
        ],
      };

      dispatch({
        type: 'UPLOAD_DOCUMENT',
        doc,
        resolvesMedicalAlert: payload.resolvesMedicalAlert,
        mvrRequestId: payload.mvrRequestId,
        timestampIso,
        notificationId: newId(),
        timelineId: newId(),
      });

      const resolvedMvr =
        Boolean(payload.mvrRequestId) || payload.title.toLowerCase().includes('mvr');
      const resolvedMed =
        Boolean(payload.resolvesMedicalAlert) || payload.title.toLowerCase().includes('medical');

      if (resolvedMvr) {
        showToast('MVR uploaded — Fleet Policy Quote moved to In Review');
      } else if (resolvedMed) {
        showToast('Medical card uploaded — compliance alert cleared');
      } else if (payload.previewOmitted) {
        showToast('File metadata saved (file over 300KB)');
      } else {
        showToast('Document uploaded to Vault');
      }
    },
    [dispatch, showToast],
  );

  const deleteDocument = useCallback(
    (id: string) => {
      const target = state.documents.find((d) => d.id === id);
      if (!target) return;
      scheduleDeleteWithUndo(
        'documents',
        { type: 'REMOVE_DOCUMENT', id },
        state.documents,
        target.title,
      );
    },
    [state.documents, scheduleDeleteWithUndo],
  );

  const recordDocumentActivity = useCallback(
    (docId: string, text: string, toastMessage?: string) => {
      dispatch({
        type: 'RECORD_DOCUMENT_ACTIVITY',
        docId,
        text,
        activityId: newId(),
        timestampIso: nowIso(),
      });
      if (toastMessage) {
        showToast(toastMessage);
      }
    },
    [dispatch, showToast],
  );

  return {
    documents: state.documents,
    categoryCounts,
    uploadDocument,
    deleteDocument,
    recordDocumentActivity,
  };
}
