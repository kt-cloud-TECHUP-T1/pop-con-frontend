import Link from 'next/link';
import { Box } from '@/components/ui/box';

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

const FOOTER_SOCIAL_LINKS: FooterLink[] = [
  { label: '인스타그램 아이콘', link: '#' },
  { label: '유튜브 아이콘', link: '#' },
  { label: '블로그 아이콘', link: '#' },
];

export const Footer = () => {
  return (
    <footer className="py-6">
      <div className="flex items-center justify-between">
        <Box className="w-[130px] h-[32px] flex items-center justify-center logo bg-[#E5E5E5] text-black">
          Logo
        </Box>
        <nav>
          <ul className="flex gap-8">
            {FOOTER_LINK.map((links) => (
              <li key={links.link}>
                <Link href={links.link}>{links.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <nav>
        {FOOTER_COMPANY_INFO.map((companys) => (
          <ul key={companys.join('-')} className="flex">
            {companys.map((company) => (
              <li key={company}>{company}</li>
            ))}
          </ul>
        ))}
      </nav>
      <div className="container mx-auto px-4">
        <p className="text-center">© 2025 PopCon. All rights reserved.</p>
        <nav>
          <ul>
            {FOOTER_SOCIAL_LINKS.map((socials) => (
              <li key={socials.label}>
                <Link href={socials.link}>{socials.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
};
