import type { ReactNode } from 'react';
import { Wrapper } from '@/components/layout/wrapper';
import { MyPageSidebar } from '@/app/(protected)/mypage/components/my-page-sidebar';
import { Typography } from '@/components/ui/typography';

type MyPageLayoutProps = {
  children: ReactNode;
};

export default function MyPageLayout({ children }: MyPageLayoutProps) {
  return (
    <Wrapper className="py-10 min-h-[650px]">
      <div className="space-y-6">
        <div className="grid gap-10 md:grid-cols-[220px_minmax(0,1fr)]">
          <aside>
            <Typography variant="title-1" weight="medium" className="mb-4">
              My 팝콘
            </Typography>
            <MyPageSidebar />
          </aside>
          <main>{children}</main>
        </div>
      </div>
    </Wrapper>
  );
}
