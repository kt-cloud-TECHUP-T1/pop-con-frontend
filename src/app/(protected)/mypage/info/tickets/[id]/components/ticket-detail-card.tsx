import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';

interface TicketDetailCardProps {
  title: string;
  rows: { label: string; value: string }[];
}

export function TicketDetailCard({ title, rows }: TicketDetailCardProps) {
  return (
    <Box as="section" radius="ML" border="var(--line-3)" padding="MS">
      <Typography variant="title-2" weight="bold" className="mb-4">
        {title}
      </Typography>
      <dl className="space-y-2">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <dt>
              <Typography
                variant="body-2"
                className="text-[var(--content-extra-low)]"
              >
                {label}
              </Typography>
            </dt>
            <dd>
              <Typography
                variant="body-2"
                weight="medium"
                className="text-[var(--content-high)]"
              >
                {value}
              </Typography>
            </dd>
          </div>
        ))}
      </dl>
    </Box>
  );
}
