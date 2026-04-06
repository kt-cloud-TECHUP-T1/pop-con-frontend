import { Checkbox } from '@/components/ui/checkbox';
import { Typography } from '@/components/ui/typography';
import { ChevronRight } from 'lucide-react';

export default function AgreementCheckbox({
  checked,
  onCheckedChange,
  label,
  isRequired,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  isRequired: boolean;
}) {
  

  return (
    <div className="flex justify-between">
      <label className="flex gap-2.5">
        <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
        <Typography variant="body-1" weight="regular">
         ({isRequired ? '필수' : '선택'}) {label}
        </Typography>
      </label>
      <ChevronRight color="#737373"  />
    </div>
  );
}
