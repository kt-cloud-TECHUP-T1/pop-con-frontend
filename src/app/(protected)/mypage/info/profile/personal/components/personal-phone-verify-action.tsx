'use client';

import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';

export function PersonalPhoneVerifyAction() {
  return (
    <Box
      as="button"
      type="button"
      paddingY="S"
      paddingX="M"
      border="#0A0A0A29"
      radius="MS"
    >
      <Typography variant="label-1" weight="medium" className="whitespace-nowrap">
        변경
      </Typography>
    </Box>
  );
}
