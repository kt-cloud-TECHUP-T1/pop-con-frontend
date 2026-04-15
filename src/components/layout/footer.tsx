'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box } from '@/components/ui/box';
import { Typography } from '../ui/typography';
import { Icon, IconName } from '../Icon/Icon';

const AUTH_PATHS = ['/login', '/signup', '/verify', '/callback'];

type FooterLink = {
  label: string;
  link: string;
};

type FooterSocialLink = {
  label: IconName;
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
    link: '/support',
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

const FOOTER_SOCIAL_LINKS: FooterSocialLink[] = [
  { label: 'LogoInstagram', link: 'https://www.instagram.com/' },
  {
    label: 'LogoYouTube',
    link: 'https://www.youtube.com/?app=desktop&hl=ko&gl=KR',
  },
  {
    label: 'LogoNaverBlog',
    link: 'https://section.blog.naver.com/BlogHome.naver?directoryNo=0&currentPage=1&groupId=0',
  },
];

export const Footer = () => {
  const pathname = usePathname();

  const isAuthPage = AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isAuthPage) return null;

  return (
    <footer className="w-full pt-10 pb-12 border-t border-[#ebebeb]">
      <Box className="max-w-[1280px] mx-auto px-10">
        <Box className="flex items-center justify-between">
          <Link href="/" className="text-black" aria-label="POP-CON 홈">
            <Image src="/Logo.svg" alt="" width={70} height={40} />
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
            <ul key={companys.join('-')} className="flex flex-wrap">
              {companys.map((company) => (
                <li
                  key={company}
                  className="flex items-center after:mx-2 after:content-['|'] last:after:hidden after:text-[#0A0A0A]/8"
                >
                  <Typography variant="body-2">{company}</Typography>
                </li>
              ))}
            </ul>
          ))}
        </address>
        <div className="mx-auto flex justify-between pt-6 border-t border-[var(--neutral-90)] text-[var(--neutral-60)]">
          <Typography variant="body-2">
            © {new Date().getFullYear()} PopCon. All rights reserved.
          </Typography>
          <nav>
            <ul className="flex gap-4">
              {FOOTER_SOCIAL_LINKS.map((socials) => (
                <li key={socials.label}>
                  <Link
                    href={socials.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name={socials.label} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Box>
    </footer>
  );
};
