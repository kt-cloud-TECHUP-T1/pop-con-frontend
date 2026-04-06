// 마이페이지 메인

import { ActivityHistorySection } from '@/app/(protected)/mypage/_main/components/activity-history-section';
import { LikedPopupsSection } from '@/app/(protected)/mypage/_main/components/liked-popups-section';
import { ProfileSummarySection } from '@/app/(protected)/mypage/_main/components/profile-summary-section';

export default function ProtectedPage() {
  return (
    <div className="space-y-20">
      {/* 프로필 + 활동 여부 */}
      <ProfileSummarySection />
      {/* 활동 내역 */}
      <ActivityHistorySection />
      {/* 찜한 팝업스토어 */}
      <LikedPopupsSection />
    </div>
  );
}
