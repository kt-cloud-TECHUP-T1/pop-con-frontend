import { MyPageHeader } from '@/app/(protected)/mypage/components/page-header';
import { ProfileSummaryCard } from '@/app/(protected)/mypage/info/profile/components/profile-summary-card';
import type { ProfileInfoItem } from '@/app/(protected)/mypage/info/profile/components/profile-info-list';

// TODO: 하드코딩 데이터를 실제 사용자 정보로 교체 필요
const PROFILE_INFO: ProfileInfoItem[] = [
  { label: '이름', value: '이상혁' },
  { label: '생년월일', value: '1996.05.07' },
  { label: '휴대폰 번호', value: '010-1234-5678' },
  { label: '이메일', value: 'account@mail.com' },
];

export default function MyPageProfilePage() {
  return (
    <section className="max-w-[960px]">
      <MyPageHeader
        title="프로필 관리"
        titleVariant="heading-1"
        titleWeight="bold"
      />
      <ProfileSummaryCard
        imageSrc="/images/temp/God-Sang-hyeok.png"
        nickname="심심한 고래"
        infoItems={PROFILE_INFO}
        settingsHref="/mypage/info/profile/settings"
        personalInfoHref="/mypage/info/profile/personal"
      />
    </section>
  );
}
