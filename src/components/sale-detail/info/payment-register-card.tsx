import { Icon } from '@/components/Icon/Icon';
import { Typography } from '@/components/ui/typography';

interface PaymentRegisterCardProps {
  title: string;
}

export default function PaymentRegisterCard({
  title,
}: PaymentRegisterCardProps) {
  return (
    <div className="flex gap-s px-ms py-s bg-[var(--orange-99)] border-[1px] border-[var(--orange-95)] rounded-ml justify-between">
      <section>
        <div>
          <div className="flex gap-2xs items-center">
            <Icon
              name="CreditCard"
              size={20}
              className="text-[var(--orange-10)]"
            />
            <Typography variant="label-2" weight="medium">
              간편결제 등록 필수
            </Typography>
          </div>
          <div className="pt-3xs">
            <Typography variant="caption-2" weight="regular">
              {title}를 위해서는 사전에 카드 정보를 등록해야 합니다.
            </Typography>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center">
        <Icon
          name="ChevronRight"
          size={16}
          className="text-[var(--orange-10)]"
        ></Icon>
      </section>
    </div>
  );
}
