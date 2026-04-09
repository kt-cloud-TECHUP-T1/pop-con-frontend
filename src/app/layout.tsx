import './globals.css';
import localFont from 'next/font/local';
import ConditionalAuthSessionRestore from '@/components/auth/conditional-auth-session-restore';
import LoginRequiredModal from '@/components/common/login-required-modal';
import PaymentRequiredModal from '@/components/sale-detail/info/payment-required-modal';
import PaymentRegisterModal from '@/components/sale-detail/info/payment-register-modal';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Footer } from '@/components/layout/footer';
import { SnackbarToaster } from '@/components/ui/snackbar';
import { AppProviders } from './providers';
import { HeaderWrapper } from '@/components/layout/header/header-wrapper';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'POP-CON',
  description:
    '긴 줄과 불공정 예약 없이, POP-CON으로 팝업스토어를 경험하세요. 추첨과 경매 시스템으로 누구에게나 공정한 기회를 제공합니다.',
  icons: {
    icon: '/favicon/popcorn-favicon.svg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  // 값이 있냐 없냐 판단
  const isLoggedIn = !!cookieStore.get('refresh_token');

  return (
    <html lang="ko">
      <body className={`${pretendard.variable} antialiased`}>
        <ConditionalAuthSessionRestore isLoggedIn={isLoggedIn} />
        <HeaderWrapper isLoggedIn={isLoggedIn} />
        <AppProviders>{children}</AppProviders>
        <Footer />
        <LoginRequiredModal></LoginRequiredModal>
        <PaymentRequiredModal />
        <PaymentRegisterModal />
        <SnackbarToaster />
      </body>
    </html>
  );
}
