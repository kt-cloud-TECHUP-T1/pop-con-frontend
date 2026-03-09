import Image from 'next/image';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import {
  ProfileInfoList,
  type ProfileInfoItem,
} from '@/app/(protected)/mypage/info/profile/components/profile-info-list';
import { ProfileActionButtons } from '@/app/(protected)/mypage/info/profile/components/profile-action-buttons';

type ProfileSummaryCardProps = {
  imageSrc: string;
  nickname: string;
  infoItems: ProfileInfoItem[];
  settingsHref: string;
};

export function ProfileSummaryCard({
  imageSrc,
  nickname,
  infoItems,
  settingsHref,
}: ProfileSummaryCardProps) {
  return (
    <Box
      as="article"
      radius="ML"
      border="#0A0A0A14"
      className="min-h-[360px] p-8 sm:p-10"
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-5">
          <Image
            src={imageSrc}
            alt="프로필 이미지"
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover"
          />
          <Typography variant="heading-2" weight="medium">
            {nickname}
          </Typography>
        </div>

        <ProfileInfoList items={infoItems} />
        <ProfileActionButtons settingsHref={settingsHref} />
      </div>
    </Box>
  );
}
