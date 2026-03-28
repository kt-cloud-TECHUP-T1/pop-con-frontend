import { PageHeader } from '@/components/shared/page-header';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/Icon/Icon';

type SocialProvider = {
  id: 'naver' | 'kakao';
  name: string;
  connected: boolean;
};

// TODO: 실제 연결 상태 API로 교체 필요
const SOCIAL_PROVIDERS: SocialProvider[] = [
  { id: 'naver', name: '네이버', connected: false },
  { id: 'kakao', name: '카카오', connected: true },
];

export default function SocialLoginSettingsPage() {
  return (
    <>
      <PageHeader
        title="소셜 로그인 설정"
        titleVariant="heading-1"
        titleWeight="bold"
      />
      <Box as="article" radius="ML" border="#0A0A0A14" padding="M">
        <div className="grid grid-cols-2 divide-x divide-[#0A0A0A14]">
          {SOCIAL_PROVIDERS.map((provider) => {
            return (
              <div
                key={provider.id}
                className="flex items-center justify-between px-8 first:pl-0 last:pr-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      provider.id === 'kakao' ? 'bg-[#FEE500]' : 'bg-[#03C75A]'
                    }`}
                  >
                    <Icon
                      name={provider.id === 'kakao' ? 'LogoKakao' : 'LogoNaver'}
                      size={24}
                      className={
                        provider.id === 'kakao'
                          ? 'text-[#3C1E1E]'
                          : 'text-white'
                      }
                    />
                  </div>
                  <Typography variant="body-1" weight="medium">
                    {provider.name}
                  </Typography>
                </div>
                {provider.connected ? (
                  <Button variant="ghost" size="small">
                    연결 해제
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="small"
                    className="text-[var(--orange-50)]"
                  >
                    연결하기
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Box>
    </>
  );
}
