import { Box } from '@/components/ui/box';
import { Checkbox } from '@/components/ui/checkbox';
import type { CheckboxProps } from '@/components/ui/checkbox';

const CHECKBOX_SAMPLES: Array<{
  label: string;
  props: Pick<CheckboxProps, 'visualState' | 'isError' | 'disabled'>;
}> = [
  { label: 'default', props: {} },
  { label: 'hover', props: { visualState: 'hover' } },
  { label: 'pressed', props: { visualState: 'pressed' } },
  { label: 'error', props: { isError: true } },
  { label: 'disabled', props: { disabled: true } },
];

export default function CheckboxSamplePage() {
  return (
    <div className="p-10">
      <div className="mb-14">
        <h1 className="text-[40px] font-bold mb-4">Checkbox</h1>
        <p>체크박스 컴포넌트 설명</p>
      </div>

      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-8">스타일</h2>
        <Box
          className="bg-[#F8F8F8] flex flex-wrap justify-center gap-10 py-16 px-10"
          radius="XL"
        >
          {CHECKBOX_SAMPLES.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <Checkbox size={48} {...item.props} />
              <span>{item.label}</span>
            </div>
          ))}
        </Box>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-8">사용 방법</h2>
        <pre className="p-4 bg-slate-50 border border-slate-200 rounded-md overflow-x-auto">
          <code className="text-sm font-mono text-slate-900">
            {`import { CommonCheckbox } from '@/components/common/CommonCheckbox';

// 1. 기본 사용
<CommonCheckbox />

// 2. 체크된 상태로 초기 렌더 (uncontrolled)
<CommonCheckbox defaultChecked />

// 3. 제어 컴포넌트로 사용 (controlled)
const [checked, setChecked] = useState(false);
<CommonCheckbox checked={checked} onCheckedChange={(value) => setChecked(!!value)} />

// 4. 에러 / 비활성 상태
<CommonCheckbox isError />
<CommonCheckbox disabled />

// 5. 사이즈 지정 (px)
<CommonCheckbox size={16} />
<CommonCheckbox size={20} />
<CommonCheckbox size={24} />`}
          </code>
        </pre>
      </div>
    </div>
  );
}
