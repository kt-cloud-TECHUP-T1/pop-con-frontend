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
      <MainBanner />
      <CategoryList />
      <Wrapper className="py-0">
        <Recommend />
        <Ranking />
        <DutchAuction />
        <LuckyDraw />
        <Magazine />
        <Notable />
        <EndingSoon />
      </Wrapper>
    </div>
  );
}
