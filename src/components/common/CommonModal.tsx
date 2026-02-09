'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RADIUS, RadiusType } from '@/constants/design-system';
import { cn } from '@/lib/utils';
import { Icon, IconName } from '@/components/Icon/Icon';

interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  radius?: RadiusType;
  showClose?: boolean;
  className?: string;
  icon?: IconName; // 아이콘 이름
  iconSize?: number; // 아이콘 크기
  iconClassName?: string; // 아이콘 스타일
}

export default function CommonModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  radius = 'LG', // design-system.ts에 맞게 작성 필요
  showClose = true,
  className,
  icon, // 기본값 없음
  iconSize = 64,
  iconClassName,
}: CommonModalProps) {
  const sizeClasses = {
    sm: 'w-[calc(100%-2rem)] max-w-[384px]',
    md: 'w-[calc(100%-2rem)] max-w-[480px]',
    lg: 'w-[calc(100%-2rem)] max-w-[512px]',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          sizeClasses[size],
          RADIUS[radius],
          'px-6 pb-8 text-center block',
          showClose ? 'pt-20' : 'pt-8',
          !showClose && '[&>button]:hidden',
          className
        )}
      >
        {title && (
          <DialogHeader>
            {/* icon prop이 있을 때만 아이콘 표시 */}
            {icon && (
              <Icon
                name={icon}
                size={iconSize}
                className={cn('m-auto', iconClassName)}
              />
            )}
            <DialogTitle className="text-[22px] font-bold text-[#262626] text-center">
              {title}
            </DialogTitle>
          </DialogHeader>
        )}
        <div className="text-[#737373]">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 모달 본문용 컴포넌트
 */
export function ModalBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'text-base text-[#525252] leading-relaxed mt-1 mb-8',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * 모달 하단 버튼 영역용 컴포넌트
 */
export function ModalFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex gap-3 justify-end mt-4', className)}>
      {children}
    </div>
  );
}
