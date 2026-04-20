import { cn } from '@/lib/utils';

type NoContentProps = {
  className?: string;
  title?: string;
  message?: string;
};

export const NoContent = ({
  className,
  message = '콘텐츠가 없어요.',
  title,
}: NoContentProps) => {
  return (
    <>
      <h2 className="justify-start text-black text-3xl font-bold leading-10 mb-6">
        {title}
      </h2>
      <div
        className={cn(
          'min-h-[250px] flex items-center justify-center',
          className
        )}
      >
        {message}
      </div>
    </>
  );
};
