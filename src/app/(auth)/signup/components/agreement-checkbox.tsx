'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Typography } from '@/components/ui/typography';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import TermsDetailContent, { TermsContent } from './terms-detail-content';

export default function AgreementCheckbox({
  checked,
  onCheckedChange,
  label,
  isRequired,
  detailContent,
  isExpanded,
  onToggleExpand,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  isRequired: boolean;
  detailContent?: TermsContent;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <label className="flex gap-2.5 cursor-pointer">
          <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
          <Typography variant="body-1" weight="regular">
            ({isRequired ? '필수' : '선택'}) {label}
          </Typography>
        </label>
        {detailContent && (
          <button
            type="button"
            onClick={onToggleExpand}
            className="p-0.5 shrink-0"
          >
            <ChevronRight
              color="#737373"
              className={cn(
                'transition-transform duration-400',
                isExpanded && 'rotate-90'
              )}
            />
          </button>
        )}
      </div>
      {detailContent && (
        <div
          className={cn(
            'grid transition-all duration-400',
            isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          )}
        >
          <div className="overflow-hidden">
            <div className="pt-3 pb-1 pl-7 pr-1 max-h-[300px] overflow-y-auto">
              <TermsDetailContent content={detailContent} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
