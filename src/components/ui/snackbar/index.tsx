'use client';

import * as React from 'react';
import { toast, Toaster, type ExternalToast } from 'sonner';
import { Icon, type IconName } from '@/components/Icon/Icon';
import { Box } from '@/components/ui/box';
import { cn } from '@/lib/utils';
import { Typography } from '../typography';

const snackbarClassName =
  'flex w-[380px] max-w-[calc(100vw-32px)] items-start text-white';

// 디자인 시스템에 따른 상태 분류
export type SnackbarVariant =
  | 'default'
  | 'informative'
  | 'alert'
  | 'success'
  | 'destructive';

// 자동 아이콘 매핑
const statusIconMap: Record<Exclude<SnackbarVariant, 'default'>, IconName> = {
  informative: 'InfoFill',
  alert: 'InfoFill',
  success: 'CircleCheckFill',
  destructive: 'CircleCloseFill',
};

const statusColorMap: Record<SnackbarVariant, string> = {
  default: 'text-white',
  informative: 'text-white',
  alert: 'text-[var(--status-warning)]',
  success: 'text-[var(--status-positive)]',
  destructive: 'text-[var(--status-warning)]',
};

export interface SnackbarProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  variant?: SnackbarVariant;
  actionLabel?: string;
  onAction?: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
  closeLabel?: string;
  hideStatusIcon?: boolean;
}

export interface ShowSnackbarOptions
  extends
    Omit<
      SnackbarProps,
      'id' | 'onClose' | 'className' | 'role' | 'children' | 'defaultValue'
    >,
    Omit<ExternalToast, 'description' | 'action' | 'cancel'> {
  id?: ExternalToast['id'];
  onClose?: () => void;
}

export const Snackbar = React.forwardRef<HTMLDivElement, SnackbarProps>(
  (
    {
      className,
      title,
      description,
      variant = 'default',
      actionLabel,
      onAction,
      showCloseButton = false,
      onClose,
      closeLabel = '닫기',
      hideStatusIcon = false,
      ...props
    },
    ref
  ) => {
    const statusIcon =
      variant === 'default' || hideStatusIcon ? null : statusIconMap[variant];

    return (
      <div ref={ref} role="status" {...props}>
        <Box
          radius="MS"
          shadow="L"
          background="#262626"
          paddingX="MS"
          paddingY="S"
          className={cn(snackbarClassName, className)}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {statusIcon ? (
              <Icon
                name={statusIcon}
                size={24}
                className={cn('mt-0.5 shrink-0', statusColorMap[variant])}
              />
            ) : null}

            <div className="min-w-0 flex-1">
              <Typography variant="body-1" weight="medium">
                {title}
              </Typography>
              {description ? (
                <Typography variant="label-2" className="mt-0.5 ">
                  {description}
                </Typography>
              ) : null}
            </div>
          </div>

          {(actionLabel || showCloseButton) && (
            <div className="ml-4 flex shrink-0 items-center gap-3 self-center">
              {actionLabel ? (
                <button
                  type="button"
                  className="text-sm font-medium leading-[1.48] text-[#FF7A00] outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white/60 rounded-[var(--radius-xs)]"
                  onClick={onAction}
                >
                  {actionLabel}
                </button>
              ) : null}

              {showCloseButton ? (
                <button
                  type="button"
                  aria-label={closeLabel}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-shape-full text-white outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white/60"
                  onClick={onClose}
                >
                  <Icon name="Close" size={20} className="shrink-0" />
                </button>
              ) : null}
            </div>
          )}
        </Box>
      </div>
    );
  }
);

Snackbar.displayName = 'Snackbar';

// sonner의 전역 토스트 렌더러
export function SnackbarToaster() {
  return (
    <Toaster
      position="bottom-center"
      expand={false}
      visibleToasts={3}
      closeButton={false}
      toastOptions={{
        unstyled: true,
      }}
      style={
        {
          '--width': '380px',
        } as React.CSSProperties
      }
    />
  );
}

// 커스텀한 Snackbar로 sonner의 toast를 바꿔치기
export function showSnackbar({
  title,
  description,
  variant = 'default',
  actionLabel,
  onAction,
  showCloseButton = false,
  onClose,
  closeLabel,
  hideStatusIcon = false,
  duration = 3000,
  ...toastOptions
}: ShowSnackbarOptions) {
  return toast.custom(
    (toastId) => (
      <Snackbar
        title={title}
        description={description}
        variant={variant}
        actionLabel={actionLabel}
        onAction={onAction}
        showCloseButton={showCloseButton}
        onClose={() => {
          onClose?.();
          toast.dismiss(toastId);
        }}
        closeLabel={closeLabel}
        hideStatusIcon={hideStatusIcon}
      />
    ),
    {
      duration,
      ...toastOptions,
    }
  );
}

export const snackbar = {
  show: showSnackbar,
  dismiss: toast.dismiss,
  default: (options: Omit<ShowSnackbarOptions, 'variant'>) =>
    showSnackbar({ ...options, variant: 'default' }),
  informative: (options: Omit<ShowSnackbarOptions, 'variant'>) =>
    showSnackbar({ ...options, variant: 'informative' }),
  alert: (options: Omit<ShowSnackbarOptions, 'variant'>) =>
    showSnackbar({ ...options, variant: 'alert' }),
  success: (options: Omit<ShowSnackbarOptions, 'variant'>) =>
    showSnackbar({ ...options, variant: 'success' }),
  destructive: (options: Omit<ShowSnackbarOptions, 'variant'>) =>
    showSnackbar({ ...options, variant: 'destructive' }),
};
