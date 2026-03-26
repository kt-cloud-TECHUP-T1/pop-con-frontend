import { Wrapper } from '@/components/layout/wrapper';
import { CategoryList } from './components/category-list';
import { DutchAuction } from './containers/dutch-auction';
import { EndingSoon } from './containers/ending-soon';
import { LuckyDraw } from './containers/lucky-draw';
import { Magazine } from './containers/magazine';
import { MainBanner } from './containers/main-banner';
import { Notable } from './containers/notable';
import { Ranking } from './containers/ranking';
import { Recommend } from './containers/recommend';

export default function Home() {
  return (
    <div className="mt-6">
      {/* 메인 배너 */}
      <MainBanner />
      {/* 카테고리 */}
      <CategoryList />
      <Wrapper className="py-0">
        {/* 팝업 추천 */}
        <Recommend />
        {/* 랭킹 */}
        <Ranking />
        {/* 더치 경매 */}
        <DutchAuction />
        {/* 드로우 */}
        <LuckyDraw />
        {/* 매거진 */}
        <Magazine />
        {/* 주목할 만한 팝업 */}
        <Notable />
        {/* 곧 종료되는 팝업 */}
        <EndingSoon />
      </Wrapper>
    </div>
  );
}
