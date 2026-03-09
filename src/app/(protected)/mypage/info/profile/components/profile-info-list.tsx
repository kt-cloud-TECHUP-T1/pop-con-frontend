import { Typography } from '@/components/ui/typography';

export type ProfileInfoItem = {
  label: string;
  value: string;
};

type ProfileInfoListProps = {
  items: ProfileInfoItem[];
};

export function ProfileInfoList({ items }: ProfileInfoListProps) {
  return (
    <dl className="grid w-full max-w-[420px] grid-cols-[100px_1fr] gap-x-4 gap-y-2">
      {items.map((item) => (
        <div key={item.label} className="contents">
          <dt>
            <Typography variant="label-1" weight="regular">
              {item.label}
            </Typography>
          </dt>
          <dd>
            <Typography variant="label-1" className="text-[var(--neutral-60)]">
              {item.value}
            </Typography>
          </dd>
        </div>
      ))}
    </dl>
  );
}
