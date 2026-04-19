import { cn } from '@/lib/utils';

type NoContentProps = {
  className?: string;
  message?: string;
};

export const NoContent = ({
  className,
  message = '콘텐츠가 없어요.',
}: NoContentProps) => {
  return (
    <div
      className={cn(
        'min-h-[250px] flex items-center justify-center',
        className
      )}
    >
      {message}
    </div>
  );
};
