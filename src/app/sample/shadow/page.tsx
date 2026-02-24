import { Box } from '@/components/ui/box';

export default function ShadowSamplePage() {
  const SHADOW_SAMPLES = [
    { key: 'S', label: 'Small' },
    { key: 'M', label: 'Medium' },
    { key: 'L', label: 'Large' },
    {
      key: 'XL',
      label: 'Extra Large',
    },
  ] as const;

  return (
    <div className="p-10">
      <div className="mb-10">
        <h1 className="text-[40px] font-bold">Elevation</h1>
        <p className="text-left text-base">
          엘리베이션은 그림자를 통해 요소를 계층화 하여 위계를 명확하게 파악할
          수 있도록 돕습니다.
        </p>
      </div>

      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-8">높이</h2>
        <Box
          className="bg-[#f7f7f7] py-20 flex justify-center gap-8"
          radius="XL"
        >
          {SHADOW_SAMPLES.map(({ key }) => (
            <Box
              key={key}
              shadow={key}
              className="flex flex-col items-center gap-4"
            >
              <div className="bg-white w-24 h-24 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">{key}</span>
              </div>
            </Box>
          ))}
        </Box>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-8">사용 방법</h2>
        <pre className="my-3 p-4 bg-slate-50 border border-slate-200 rounded-md overflow-x-auto">
          <code className="text-sm font-mono text-slate-900">
            {`import { SHADOW } from '@/constants/design-system';

<div className={\`\${SHADOW.M}\`}>
  Medium elevation
</div>

<div className={\`\${SHADOW.XL}\`}>
  Extra large elevation
</div>`}
          </code>
        </pre>
      </div>
    </div>
  );
}
