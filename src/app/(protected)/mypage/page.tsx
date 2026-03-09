import { ActivityHistorySection } from '@/app/(protected)/mypage/_main/components/activity-history-section';
import { LikedPopupsSection } from '@/app/(protected)/mypage/_main/components/liked-popups-section';
import { ProfileSummarySection } from '@/app/(protected)/mypage/_main/components/profile-summary-section';

export default function ProtectedPage() {
  return (
    <div className="space-y-20">
      <ProfileSummarySection />
      <ActivityHistorySection />
      <LikedPopupsSection />
    </div>
  );
}
