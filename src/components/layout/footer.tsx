import Link from 'next/link';
import { Box } from '@/components/ui/box';
import { Typography } from '../ui/typography';

type FooterLink = {
  label: string;
  link: string;
};

const FOOTER_LINK: FooterLink[] = [
  {
    label: '이용약관',
    link: '/terms',
  },
  {
    label: '개인정보처리방침',
    link: '/privacy',
  },
  {
    label: '고객센터',
    link: '/customer-service',
  },
  {
    label: '공지사항',
    link: '/notice',
  },
];

const FOOTER_COMPANY_INFO = [
  ['(주)팝콘', '대표이사 김팝콘'],
  ['서울특별시 강남구 테헤란로 145 타운홀 14층', '전화번호: 02-123-4567'],
  ['사업자등록번호: 123-45-67890', '통신판매번호: 2025-서울강남-1234'],
] as const;

// TODO 실제 아이콘 삽입하기
const FOOTER_SOCIAL_LINKS: FooterLink[] = [
  { label: '인스타그램 아이콘', link: 'https://www.instagram.com/' },
  {
    label: '유튜브 아이콘',
    link: 'https://www.youtube.com/?app=desktop&hl=ko&gl=KR',
  },
  {
    label: '블로그 아이콘',
    link: 'https://section.blog.naver.com/BlogHome.naver?directoryNo=0&currentPage=1&groupId=0',
  },
];

export const Footer = () => {
  return (
    <footer className="w-full py-6">
      <Box className="max-w-[1280px] mx-auto px-10">
        <Box className="flex items-center justify-between">
          <Link
            href="/"
            className="w-[130px] h-[32px] flex items-center justify-center logo bg-[#E5E5E5] text-black"
          >
            Logo
          </Link>
          <nav>
            <ul className="flex gap-8">
              {FOOTER_LINK.map((links) => (
                <li key={links.link}>
                  <Link href={links.link}>{links.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </Box>
        <address className="not-italic text-[var(--neutral-60)] mb-8 mt-6">
          {FOOTER_COMPANY_INFO.map((companys) => (
            <ul key={companys.join('-')} className="flex space-y-1">
              {companys.map((company) => (
                <li key={company}>
                  <Typography variant="body-2">{company}</Typography>
                </li>
              ))}
            </ul>
          ))}
        </address>
        <div className="container mx-auto flex justify-between pt-6 border-t border-color-[var(--neutral-90)] text-[var(--neutral-60)]">
          <Typography variant="body-2">
            © {new Date().getFullYear()} PopCon. All rights reserved.
          </Typography>
          <nav>
            <ul className="flex gap-4">
              {FOOTER_SOCIAL_LINKS.map((socials) => (
                <li key={socials.label}>
                  <Link href={socials.link}>{socials.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Box>
    </footer>
  );
};
