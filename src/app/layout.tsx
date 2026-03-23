import './globals.css';
import localFont from 'next/font/local';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SnackbarToaster } from '@/components/ui/snackbar';
import { AppProviders } from './providers';
import AuthSessionRestore from '@/components/auth/auth-session-restore';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'POP-CON',
  description:
    '긴 줄과 불공정 예약 없이, POP-CON으로 팝업스토어를 경험하세요. 추첨과 경매 시스템으로 누구에게나 공정한 기회를 제공합니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} antialiased`}>
        <AuthSessionRestore />
        <Header />
        <AppProviders>{children}</AppProviders>
        <Footer />
        <SnackbarToaster />
      </body>
    </html>
  );
}
