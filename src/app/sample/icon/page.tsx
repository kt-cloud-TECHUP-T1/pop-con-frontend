'use client';

import { Icon, type IconName } from '@/components/Icon/Icon';
import { RADIUS } from '@/constants/design-system';

// 아이콘 리스트를 배열로 관리하면 유지보수가 훨씬 편합니다.
const ICON_LIST: IconName[] = [
  'Bell',
  'Comment',
  'Heart',
  'Home',
  'Like',
  'Person',
  'Pin',
];

export default function CommonIconSamplePage() {
  return (
    <div className="p-10">
      <div className="mb-14">
        <h1 className="text-[40px] font-bold mb-4">Icon</h1>
        <p>
          아이콘은 기능, 행동, 사물 등을 기호로 만든 시각적인 언어로 한정된
          공간에서 효율적으로 정보를 전달하는 역할을 합니다.
          <br />
          아이콘 디자인의 일관성을 유지하기 위해 제작 가이드라인을 준수해야
          합니다.
        </p>
      </div>

      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-8">아이콘</h2>
        <div
          className={`${RADIUS.XL} bg-[#F8F8F8] flex justify-center gap-8 py-16 px-10`}
        >
          {['Home', 'Like', 'Comment'].map((name) => (
            <div key={name} className="flex flex-col items-center gap-3">
              <div
                className={`${RADIUS.ML} bg-white w-24 h-24 flex justify-center items-center`}
              >
                <Icon name={name as IconName} size={50} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-3">스타일 가이드</h2>
          <p>
            outline, fill 2가지 스타일을 사용하며, 맥락에 따라 누구나 쉽게
            이해할 수 있도록 간결하게 제작합니다.
            <br />
            Fill의 경우 활성화 또는 선택된 상태일 때 요소에 적용합니다.
          </p>
        </div>

        <div
          className={`${RADIUS.XL} bg-[#F8F8F8] flex flex-col gap-8 py-16 px-10`}
        >
          <section>
            <div className="flex gap-8 justify-center">
              {ICON_LIST.map((name) => (
                <div key={name} className="flex flex-col items-center gap-3">
                  <Icon name={name} size={32} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex gap-8 justify-center">
              {ICON_LIST.map((name) => (
                <div
                  key={`${name}Fill`}
                  className="flex flex-col items-center gap-3"
                >
                  <Icon name={`${name}Fill` as IconName} size={32} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex gap-8 justify-center">
              {ICON_LIST.map((name) => (
                <div
                  key={`color-${name}`}
                  className="flex flex-col items-center gap-3"
                >
                  <Icon
                    name={`${name}Fill` as IconName}
                    size={32}
                    className="text-blue-500/50"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-8">사용 방법</h2>
        <pre className="my-3 p-4 bg-slate-50 border border-slate-200 rounded-md overflow-x-auto">
          <code className="text-sm font-mono text-slate-900">
            {`import { Icon } from '@/components/Icon/Icon';

// 1. 기본 아이콘
<Icon
  name='Bell'
  size={32}
/>

// 2. 기본 아이콘 (색상 주입)
<Icon
  name='Bell'
  size={32}
  className="text-blue-500/50"
/>

// 3. 채워진 아이콘
<Icon
  name='BellFill'
  size={32}
/>

// 4. 채워진 아이콘 (색상 주입)
<Icon
  name='BellFill'
  size={32}
  className="text-blue-500/50"
/>`}
          </code>
        </pre>
      </div>
    </div>
  );
}
