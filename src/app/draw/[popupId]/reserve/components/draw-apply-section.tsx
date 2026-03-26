'use client';

import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Typography } from '@/components/ui/typography';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DrawApplySectionProps {
  drawId: string;
  selectedOptionId: number | null;
}

export default function DrawApplySection({
  drawId,
  selectedOptionId,
}: DrawApplySectionProps) {
  const [checks, setChecks] = useState([false, false]);
  const router = useRouter();

  const handleCheck = (index: number, checked: boolean) => {
    setChecks((prev) => {
      const next = [...prev];
      next[index] = checked;
      return next;
    });
  };

  const handleSubmit = () => {
    router.push(`/draw/${drawId}/success`);
  };

  const isAllChecked = checks.every(Boolean);

  return (
    <div className="pt-ms flex flex-col gap-ms">
      <div className="assign flex flex-col gap-s">
        <Typography variant="body-1" weight="bold">
          이용 약관 동의
        </Typography>

        <div className="flex flex-col gap-2xs">
          <div className="flex gap-xs">
            <Checkbox
              checked={checks[0]}
              onCheckedChange={(checked) => handleCheck(0, checked === true)}
            />
            <Typography variant="body-2" weight="regular">
              (필수){' '}
              <Link className="underline" href={`/draw/${drawId}`}>
                드로우 이용약관
              </Link>
              을 동의합니다.
            </Typography>
          </div>
          <div className="flex gap-xs">
            <Checkbox
              checked={checks[1]}
              onCheckedChange={(checked) => handleCheck(1, checked === true)}
            />
            <Typography variant="body-2" weight="regular">
              (필수){' '}
              <Link className="underline" href={`/draw/${drawId}`}>
                개인정보 제 3자 제공
              </Link>
              을 동의합니다.
            </Typography>
          </div>
        </div>
      </div>

      <Button
        disabled={!isAllChecked || selectedOptionId === null}
        onClick={handleSubmit}
      >
        드로우 신청하기
      </Button>
    </div>
  );
}