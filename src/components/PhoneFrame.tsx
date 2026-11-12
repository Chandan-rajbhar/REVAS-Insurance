import React from 'react';
import { Wifi } from 'lucide-react';
import { InFrameToast, type ToastData } from './ui';

interface PhoneFrameProps {
  children: React.ReactNode;
  toast: ToastData | null;
  onDismissToast: () => void;
  overlays?: React.ReactNode;
  reduceMotion?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  toast,
  onDismissToast,
  overlays,
  reduceMotion = false,
}) => {
  return (
    <div className={`phone-viewport-stage ${reduceMotion ? 'reduce-motion' : ''}`}>
      <div className="phone-frame">
        {/* Simulated status bar: ONLY rendered on large desktop screens where the phone frame is active */}
        <div className="hidden desk:flex shrink-0 h-[30px] bg-white px-6 items-center justify-between select-none relative z-20">
          <span className="text-[12px] font-bold tracking-tight text-[#0F172A]">
            9:41
          </span>

          <div className="w-[84px] h-[20px] rounded-full bg-[#111111] flex items-center justify-end pr-2 shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E293B] ring-1 ring-[#334155]/60" />
          </div>

          <div className="flex items-center gap-1.5 text-[#0F2A3F]">
            <div className="flex items-end gap-[1.5px] h-2.5">
              <span className="w-[2.5px] h-[4px] rounded-[0.5px] bg-[#0F2A3F]" />
              <span className="w-[2.5px] h-[6px] rounded-[0.5px] bg-[#0F2A3F]" />
              <span className="w-[2.5px] h-[8px] rounded-[0.5px] bg-[#0F2A3F]" />
              <span className="w-[2.5px] h-[10px] rounded-[0.5px] bg-[#0F2A3F]" />
            </div>
            <Wifi className="w-3.5 h-3.5 stroke-[2.3]" />
            <div className="flex items-center">
              <div className="w-[19px] h-[10px] rounded-[3px] border border-[#0F2A3F]/80 p-[1.5px] flex items-center">
                <div className="w-full h-full rounded-[1px] bg-[#0F2A3F]" />
              </div>
              <div className="w-[1.5px] h-[4px] rounded-r-[1px] ml-[1px] opacity-80 bg-[#0F2A3F]" />
            </div>
          </div>
        </div>

        {/* Main App Content inside Container */}
        <div className="flex-1 min-h-0 w-full flex flex-col relative overflow-hidden">
          {children}
        </div>

        {/* Simulated Home Indicator: ONLY rendered inside desktop phone frame */}
        <div className="hidden desk:flex shrink-0 h-[14px] bg-white items-center justify-center">
          <div className="w-[116px] h-[4px] rounded-full bg-[#0F172A]/20" />
        </div>

        {/* All Overlays & Toasts render strictly inside the app root / phone frame */}
        <InFrameToast toast={toast} onDismiss={onDismissToast} />
        {overlays}
      </div>
    </div>
  );
};
