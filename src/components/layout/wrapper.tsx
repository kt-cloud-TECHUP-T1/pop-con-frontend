import { PropsWithChildren } from 'react';

export const Wrapper = ({ children }: PropsWithChildren) => {
  return (
    // TODO pt-120px 박은 것 유동적으로 바뀌도록 수정이 필요함
    <div className="w-full max-w-[1280px] mx-auto px-10 pt-[120px]">
      {children}
    </div>
  );
};
