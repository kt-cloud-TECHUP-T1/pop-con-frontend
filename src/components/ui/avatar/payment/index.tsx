import * as BaseIcons from '@/components/Icon/icons';
import * as UiIcons from '@/components/Icon/ui-icons';
import { AVATAR_SIZE, type AvatarSizeType } from '@/constants/design-system';
import { cn } from '@/lib/utils';

const ALL_ICONS = { ...BaseIcons, ...UiIcons };

// billing/keys API 실제 응답의 cardName 값대로 한글로 작성했습니다!
const BRAND_ICON_MAP: Partial<Record<string, keyof typeof ALL_ICONS>> = {
  하나카드: 'PaymentHana',
  현대카드: 'PaymentHyundai',
  KB국민카드: 'PaymentKb',
  케이뱅크: 'PaymentKbank',
  신한카드: 'PaymentShinhan',
  우리카드: 'PaymentWoori',
};

type PaymentAvatarProps = {
  brandCode?: string;
  size?: AvatarSizeType;
  className?: string;
};

export function PaymentAvatar({
  brandCode,
  size = 'LG',
  className,
}: PaymentAvatarProps) {
  const iconName = brandCode ? BRAND_ICON_MAP[brandCode] : null;
  const PaymentIcon = iconName ? ALL_ICONS[iconName] : null;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-full flex items-center justify-center',
        AVATAR_SIZE[size],
        !PaymentIcon && 'bg-[var(--neutral-90)]',
        className
      )}
    >
      {PaymentIcon ? (
        <PaymentIcon width="100%" height="100%" />
      ) : (
        <BaseIcons.CreditCard className="w-1/2 h-1/2 text-[var(--content-extra-low)]" />
      )}
    </div>
  );
}
