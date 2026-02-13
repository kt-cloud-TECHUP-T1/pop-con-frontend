import { Box } from '@/components/common/CommonBox';
import { RadiusType } from '@/constants/design-system';

export default function CommonShapeSamplePage() {
  const BOX_SIZES: Array<{
    key: RadiusType;
    label: string;
  }> = [
    { key: 'NONE', label: 'rounded-shape-none' },
    { key: 'XXS', label: 'rounded-2xs' },
    { key: 'XS', label: 'rounded-xs' },
    { key: 'S', label: 'rounded-s' },
    { key: 'MS', label: 'rounded-ms' },
    { key: 'M', label: 'rounded-m' },
    { key: 'ML', label: 'rounded-ml' },
    { key: 'LG', label: 'rounded-lg' },
    { key: 'XL', label: 'rounded-xl' },
    { key: '_2XL', label: 'rounded-2xl' },
    { key: '_3XL', label: 'rounded-3xl' },
    { key: 'FULL', label: 'rounded-shape-full' },
  ];

  return (
    <div className="p-10">
      <div className="mb-10">
        <h1 className="text-[40px] font-bold">Shape</h1>
        <p className="text-left text-base">
          팝콘 서비스에는 다양한 구성 요소에 둥근 모서리를 적용합니다. 이러한
          Shape의 값은 적용되는 구성 요소의 크기에 따라 달라지며, <br />
          동일한 레벨에서는 일관된 값을 사용합니다
        </p>
      </div>

      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-8">곡선</h2>
        <Box
          radius="XL"
          className="bg-[#F7F7F7] flex flex-wrap justify-center gap-8 py-16 px-20"
        >
          {BOX_SIZES.map(({ key, label }) => (
            <div key={key} className="text-center">
              <Box
                key={key}
                radius={key}
                className="bg-white w-18 h-18 m-auto"
              />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </Box>
      </div>

      {/* 사용 방법 */}
      <div>
        <h2 className="text-2xl font-bold mb-8">사용 방법</h2>
        <pre className="p-4 bg-slate-50 border border-slate-200 rounded-md overflow-x-auto">
          <code className="text-sm font-mono text-slate-900">
            {`import { Box } from '@/components/common/CommonBox';

// 1. 기본 박스
<Box/>

// 2. radius 적용한 박스
<Box radius='_2XL'>radius</Box>

// 3. shadow 적용한 박스
<Box shadow='XL'>shadow</Box>
`}
          </code>
        </pre>
      </div>
    </div>
  );
}
