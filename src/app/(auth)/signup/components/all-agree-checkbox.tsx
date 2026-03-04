import { Checkbox } from '@/components/ui/checkbox';
import { Typography } from '@/components/ui/typography';

export default function AllAgreeCheckbox({
    checked,
    onCheckedChange,
}: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}) {
  return (
        <label className="flex gap-2.5">
          <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
          <Typography variant="body-1" weight="regular">
            약관 전체 동의
          </Typography>
        </label>
  );
}
