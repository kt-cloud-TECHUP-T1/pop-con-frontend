import { cn } from '@/lib/utils';

type WrapperProps = React.ComponentProps<'div'>;

export const Wrapper = ({ className, children, ...props }: WrapperProps) => {
  return (
    <div
      className={cn(
        'w-full max-w-[1280px] min-h-screen mx-auto px-10 ',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
