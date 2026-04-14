import type { ReactNode } from 'react';
import { Wrapper } from '@/components/layout/wrapper';
import { MyPageSidebar } from '@/app/(protected)/mypage/components/my-page-sidebar';
import AuthGuard from '@/app/(protected)/mypage/components/auth-guard';

type MyPageLayoutProps = {
  children: ReactNode;
};

export default function MyPageLayout({ children }: MyPageLayoutProps) {
  return (
    <Wrapper className="min-h-[650px] py-10 md:py-12">
      <AuthGuard>
        <div className="grid items-start gap-8 md:grid-cols-[180px_minmax(0,1fr)] lg:gap-16">
          <aside>
            <MyPageSidebar />
          </aside>
          <main>{children}</main>
        </div>
      </AuthGuard>
    </Wrapper>
  );
}
