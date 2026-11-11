import React, { useEffect, useState } from 'react';
import { Check, ChevronDown, RefreshCw, X } from 'lucide-react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'lg',
  ...props
}) => {
  const padClass =
    padding === 'none'
      ? ''
      : padding === 'sm'
        ? 'p-3'
        : padding === 'md'
          ? 'p-3.5'
          : 'p-4';

  return (
    <div
      className={`w-full min-w-0 bg-white rounded-2xl shadow-[0_1px_4px_rgba(15,23,42,0.05)] ${padClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export type BadgeTone = 'neutral' | 'teal' | 'red';

export interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
  mono?: boolean;
  className?: string;
}

const BADGE_STYLES: Record<BadgeTone, string> = {
  teal: 'bg-[#D9F2EA] text-[#0B6B5A]',
  neutral: 'bg-[#EEF3FB] text-[#334155]',
  red: 'bg-[#FEE2E2] text-[#B91C1C]',
};

const DOT_COLORS: Record<BadgeTone, string> = {
  teal: 'bg-[#0B6B5A]',
  neutral: 'bg-[#475569]',
  red: 'bg-[#B91C1C]',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  tone = 'neutral',
  dot = false,
  mono = false,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-semibold leading-5 whitespace-nowrap ${
        mono ? 'font-mono' : ''
      } ${BADGE_STYLES[tone]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT_COLORS[tone]}`} />}
      {children}
    </span>
  );
};

export interface ProgressBarProps {
  percent: number;
  height?: 'sm' | 'md';
  trackColor?: string;
  fillColor?: string;
  label?: string;
  animateOnMount?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  height = 'md',
  trackColor = 'bg-[#E2E8F0]',
  fillColor = 'bg-[#0B6B5A]',
  label = 'Progress',
  animateOnMount = false,
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full rounded-full overflow-hidden ${trackColor} ${
        height === 'sm' ? 'h-1.5' : 'h-2'
      } ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${fillColor} ${
          animateOnMount ? 'progress-grow' : ''
        }`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};

export interface StepItem {
  name: string;
  state: 'done' | 'active' | 'pending';
}

export const StepTracker: React.FC<{
  steps: StepItem[];
}> = ({ steps }) => {
  return (
    <div className="relative flex items-start justify-between pt-1">
      <div className="absolute top-[15px] left-6 right-6 h-[2px] bg-[#E2E8F0]" />
      {steps.map((step, idx) => {
        const isDone = step.state === 'done';
        const isActive = step.state === 'active';
        return (
          <div key={step.name} className="relative z-10 flex flex-col items-center flex-1 min-w-0 px-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors ${
                isDone
                  ? 'bg-[#0B6B5A] text-white'
                  : isActive
                    ? 'bg-[#0F2A3F] text-white ring-4 ring-[#0F2A3F]/10'
                    : 'bg-[#EEF3FB] text-[#475569]'
              }`}
            >
              {isDone ? (
                <Check className="w-3.5 h-3.5 stroke-[2.75]" />
              ) : isActive ? (
                <RefreshCw className="w-3.5 h-3.5 stroke-[2.4]" />
              ) : (
                <span>{idx + 1}</span>
              )}
            </div>
            <span
              className={`mt-1.5 text-[12px] text-center truncate max-w-full ${
                isDone
                  ? 'font-semibold text-[#0B6B5A]'
                  : isActive
                    ? 'font-bold text-[#0F172A]'
                    : 'font-medium text-[#475569]'
              }`}
            >
              {step.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export type ButtonVariant = 'primary' | 'secondary' | 'teal' | 'danger' | 'outline-light';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[#0F2A3F] via-[#0E434D] to-[#0B6B5A] text-white hover:brightness-110 pressable shadow-xs',
  secondary: 'bg-[#EEF3FB] text-[#0F172A] hover:bg-[#E2EAF6] pressable',
  teal: 'bg-[#0B6B5A] text-white hover:bg-[#095749] pressable',
  danger: 'bg-[#B91C1C] text-white hover:bg-[#991B1B] pressable',
  'outline-light': 'bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] pressable',
};

const BUTTON_SIZES = {
  sm: 'min-h-[44px] px-3.5 py-2 text-[13px] rounded-xl',
  md: 'min-h-[44px] px-4 py-2.5 text-[14px] rounded-xl',
  lg: 'min-h-[48px] px-4 py-3 text-[15px] rounded-xl',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${
        BUTTON_VARIANTS[variant]
      } ${BUTTON_SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export interface SectionHeaderProps {
  title: string;
  rightText?: string;
  onRightClick?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  rightText,
  onRightClick,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 min-w-0">
      <h2 className="text-[16px] font-bold text-[#0F172A] tracking-tight truncate">{title}</h2>
      {rightText &&
        (onRightClick ? (
          <button
            type="button"
            onClick={onRightClick}
            className="min-h-[44px] inline-flex items-center text-[14px] font-semibold text-[#0B6B5A] hover:underline shrink-0 cursor-pointer"
          >
            {rightText}
          </button>
        ) : (
          <span className="text-[14px] font-medium text-[#475569] shrink-0">{rightText}</span>
        ))}
    </div>
  );
};

/**
 * Tracks mobile software keyboard height via visualViewport API
 * so bottom sheets move upward when an input inside the sheet is focused.
 */
function useVisualViewportKeyboardOffset(active: boolean): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!active) return;
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      const kbHeight = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setOffset(kbHeight > 40 ? kbHeight : 0);
    };

    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, [active]);

  return active ? offset : 0;
}

export interface InFrameBottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const InFrameBottomSheet: React.FC<InFrameBottomSheetProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
}) => {
  const keyboardOffset = useVisualViewportKeyboardOffset(open);

  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end bg-[#0F2A3F]/50 backdrop-blur-[1.5px]"
      style={{ paddingBottom: keyboardOffset > 0 ? `${keyboardOffset}px` : undefined }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="sheet-enter w-full bg-white rounded-t-3xl shadow-2xl flex flex-col"
        style={{
          maxHeight: keyboardOffset > 0 ? `calc(85dvh - ${keyboardOffset}px)` : 'min(85dvh, 85%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#CBD5E1]" />
        </div>
        <div className="flex items-start justify-between gap-3 px-4 pt-1 pb-3 shrink-0">
          <div className="min-w-0 py-0.5">
            <h3 className="text-[17px] font-bold text-[#0F172A] leading-snug line-clamp-2">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[14px] text-[#475569] mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="w-11 h-11 -mr-2 -mt-1 rounded-full flex items-center justify-center shrink-0 cursor-pointer group"
          >
            <span className="w-9 h-9 rounded-full bg-[#EEF3FB] text-[#334155] flex items-center justify-center group-hover:bg-[#E2EAF6]">
              <X className="w-4 h-4" />
            </span>
          </button>
        </div>
        <div className="scroll-area px-4 pb-4 safe-bottom-padded">{children}</div>
      </div>
    </div>
  );
};

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastData {
  id: number;
  message: string;
  tone?: 'success' | 'info' | 'warning';
  action?: ToastAction;
}

export const InFrameToast: React.FC<{
  toast: ToastData | null;
  onDismiss: () => void;
}> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  const toneBg =
    toast.tone === 'warning'
      ? 'bg-[#B91C1C] text-white'
      : toast.tone === 'info'
        ? 'bg-[#0F2A3F] text-white'
        : 'bg-[#0B6B5A] text-white';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`toast-enter absolute top-[calc(env(safe-area-inset-top)+60px)] desk:top-[88px] left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-24px)] max-w-[440px] rounded-xl pl-3.5 pr-1.5 py-1 min-h-[48px] shadow-lg flex items-center justify-between gap-2 ${toneBg}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Check className="w-3.5 h-3.5 stroke-[2.75]" />
        </span>
        <span className="text-[14px] font-medium leading-snug">{toast.message}</span>
      </div>
      <div className="flex items-center shrink-0">
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action?.onClick();
              onDismiss();
            }}
            className="min-h-[44px] px-3 rounded-lg text-[14px] font-bold text-white underline underline-offset-2 hover:bg-white/10 cursor-pointer"
          >
            {toast.action.label}
          </button>
        )}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="w-11 h-11 flex items-center justify-center text-white/90 hover:text-white shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export interface InFrameSelectProps {
  label: string;
  required?: boolean;
  value: string;
  options: string[];
  icon?: React.ReactNode;
  onSelect: (value: string) => void;
  onOpenPicker: (title: string, options: string[], current: string, onSelect: (v: string) => void) => void;
}

export const InFrameSelect: React.FC<InFrameSelectProps> = ({
  label,
  required,
  value,
  options,
  icon,
  onSelect,
  onOpenPicker,
}) => {
  return (
    <div>
      <label className="block text-[14px] font-semibold text-[#0F172A] mb-1.5">
        {label}
        {required && <span className="text-[#B91C1C] ml-0.5">*</span>}
      </label>
      <button
        type="button"
        onClick={() => onOpenPicker(label, options, value, onSelect)}
        className="w-full min-h-[44px] bg-[#EEF3FB] hover:bg-[#E2EAF6] rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 text-left cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && <span className="text-[#334155] shrink-0">{icon}</span>}
          <span className="text-[14px] font-medium text-[#0F172A] truncate">{value}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-[#475569] shrink-0" />
      </button>
    </div>
  );
};

export const ScreenSkeleton: React.FC = () => {
  return (
    <div
      aria-busy="true"
      aria-label="Loading screen"
      className="px-4 py-4 space-y-4 animate-pulse"
    >
      <div className="h-28 rounded-2xl bg-[#E2E8F0]" />
      <div className="h-24 rounded-2xl bg-white p-4 space-y-3">
        <div className="h-4 w-2/3 rounded bg-[#EEF3FB]" />
        <div className="h-3.5 w-1/2 rounded bg-[#EEF3FB]" />
      </div>
      <div className="h-32 rounded-2xl bg-white p-4 space-y-3">
        <div className="h-4 w-1/2 rounded bg-[#EEF3FB]" />
        <div className="h-10 w-full rounded-xl bg-[#EEF3FB]" />
      </div>
    </div>
  );
};

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <Card className="text-center py-8 px-4 flex flex-col items-center">
      <div className="w-12 h-12 rounded-2xl bg-[#EEF3FB] text-[#334155] flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-[16px] font-bold text-[#0F172A]">{title}</h3>
      <p className="text-[14px] text-[#475569] mt-1 max-w-[260px] leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="md" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export interface PhotoAsset {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  width: number;
  height: number;
}

export interface ResponsivePhotoProps {
  asset: PhotoAsset;
  className?: string;
  imgClassName?: string;
  style?: React.CSSProperties;
  lazy?: boolean;
  priority?: boolean;
  fallbackSolid?: boolean;
}

export const ResponsivePhoto: React.FC<ResponsivePhotoProps> = ({
  asset,
  className = '',
  imgClassName = 'object-cover',
  style,
  lazy = true,
  priority = false,
  fallbackSolid = false,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const hasExplicitPosition = /(?:^|\s)!?(?:absolute|fixed|sticky)(?:\s|$)/.test(className);

  return (
    <div
      className={`${hasExplicitPosition ? '' : 'relative '}overflow-hidden ${
        fallbackSolid
          ? 'bg-[#0F2A3F]'
          : 'bg-gradient-to-br from-[#10283E] to-[#0F2A3F]'
      } ${className}`}
    >
      {!loaded && !failed && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#10283E] via-[#173A58] to-[#0B6B5A]/60 animate-pulse"
        />
      )}
      {!failed && (
        <img
          src={asset.src}
          srcSet={asset.srcSet}
          sizes={asset.sizes}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          loading={lazy ? 'lazy' : 'eager'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={style}
          className={`w-full h-full transition-all duration-300 ${
            loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-xs'
          } ${imgClassName}`}
        />
      )}
    </div>
  );
};
