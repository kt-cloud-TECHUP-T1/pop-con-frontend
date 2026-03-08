import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const INTRODUCTION_LINES = [
  'Lee가 101 라인 101주년을 기념해 더현대 서울에서 팝업을 진행합니다.🎁',
  '오랜 시간 쌓아온 데님 헤리티지와 101 라인의 상징성을 공간 안에 풀어냈습니다.',
  '다양한 리워드와 팝업 기간동안의 특별한 혜택을 받아보세요!💎',
];

const EVENT_SECTIONS = [
  {
    title: '① 02.18 PM 1:01 선착순 이벤트',
    description: [
      '팝업 스토어 촬영 후 인스타그램 스토리 업로드 시, 선착순 101명 볼캡 증정',
    ],
    items: [],
  },
  {
    title: '② 구매 금액대별 혜택',
    description: [],
    items: [
      '40만원 이상 → 반다나 반팔 티셔츠(20명)',
      '20만원 이상 → 빅 트위치 로고 투웨이 에코백(30명)',
      '10만원 이상 → 오버롤 미니 파우치(30명)',
      '제품 구매 고객 → 금속 뱃지 세트(200명) *ACC 제외',
    ],
  },
  {
    title: '③ 럭키드로우 이벤트',
    description: [
      'Lee 공식 인스타그램 팔로우하고 스토리 업로드 시 : 럭키드로우 참여 기회 제공',
    ],
    items: [
      '1등 실버지 셋업(3명)',
      '2등 Lee 빈티지 라벨 티셔츠(5명)',
      '3등 스몰 트위치 로고 데님 볼캡(10명)',
      '4등 오버롤 키링(20명)',
      '5등 101 원형 뱃지 *컬러 랜덤(1000명)',
    ],
  },
];

const INFO_ROWS = [
  {
    label: '📍장소',
    value: '서울 영등포구 여의대로 108, 더현대 서울',
  },
  {
    label: '📅일정',
    value: '2/18(수) ~ 2/25(수)',
  },
  {
    label: '⏰시간',
    value: '월-목 10:30 ~ 20:00 / 금-일 10:30 ~ 20:30',
  },
];

interface SaleContentProps {
  className?: string;
}

export default function SaleContent({ className }: SaleContentProps) {
  return (
    <section
      id="content"
      className={cn('w-full', className)}
      aria-labelledby="sale-content-heading"
    >
      <div>
        <Typography variant="title-1" weight="bold">
          소개
        </Typography>
      </div>
      <div className="flex flex-col gap-m">
        <ContentSection>
          <div>
            {INTRODUCTION_LINES.map((row, idx) => (
              <p key={idx}>{row}</p>
            ))}
          </div>
        </ContentSection>
        <ContentSection title="[EVENT]">
          <div>
            {EVENT_SECTIONS.map((section, idx) => (
              <div key={idx}>
                <p>{section.title}</p>

                {section.description.length > 0 && (
                  <div>
                    {section.description.map((row, idx) => (
                      <p key={idx}>{row}</p>
                    ))}
                  </div>
                )}
                {section.items.length > 0 && (
                  <ul>
                    {section.items.map((row, idx) => (
                      <li key={idx}>{row}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </ContentSection>
        <ContentSection title="[INFO]">
          <div>
            {INFO_ROWS.map((row, idx) => (
              <p key={idx}>
                <span>
                  {row.label} : {row.value}
                </span>
              </p>
            ))}
          </div>
        </ContentSection>
      </div>
    </section>
  );
}

interface ContentSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

function ContentSection({ title, className, children }: ContentSectionProps) {
  return (
    <section className={className}>
      <Typography variant="body-1" weight="regular">
        <div>{title}</div>
        <div>{children}</div>
      </Typography>
    </section>
  );
}
