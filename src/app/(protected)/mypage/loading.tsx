import {
  ActivityHistorySectionSkeleton,
  LikedPopupsSectionSkeleton,
  ProfileSummarySectionSkeleton,
} from './components/skeletons';

export default function Loading() {
  return (
    <div className="space-y-20">
      <ProfileSummarySectionSkeleton />
      <ActivityHistorySectionSkeleton />
      <LikedPopupsSectionSkeleton />
    </div>
  );
}
