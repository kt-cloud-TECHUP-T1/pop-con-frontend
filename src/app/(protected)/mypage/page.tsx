import { Wrapper } from '@/components/layout/wrapper';
import { MyPageSidebar } from '@/components/mypage/my-page-sidebar';
import { Typography } from '@/components/ui/typography';

export default function ProtectedPage() {
  return (
    <Wrapper className="pt-10">
      <div>
        <Typography variant="title-1" weight="medium" className="mb-4">
          My 팝콘
        </Typography>
        <MyPageSidebar pathname="/mypage" />
      </div>
    </Wrapper>
  );
}
