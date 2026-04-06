'use client';

import { useState } from 'react';
import CommonModal, { ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { IconName } from '@/components/Icon/Icon';

const MODAL_SAMPLES = [
  {
    id: 'normal-false',
    num: '1',
    title: 'Normal - False',
    description:
      '상단 닫기/타입 Normal - False인 경우입니다. showClose props 값을 false로 설정하면 됩니다.',
    showClose: false,
    icon: undefined,
  },
  {
    id: 'normal-true',
    num: '2',
    title: 'Normal - True',
    description:
      '상단 닫기/타입 Normal - True인 경우입니다. showClose props 값을 true로 설정하면 됩니다.',
    showClose: true,
    icon: undefined,
  },
  {
    id: 'icon-false',
    num: '3',
    title: 'Icon - False',
    description:
      '상단 닫기/타입 Icon - False인 경우입니다. icon props 값에 사용할 아이콘 이름을 설정하시면 됩니다.',
    showClose: true,
    icon: 'Blank' as IconName,
  },
  {
    id: 'icon-true',
    num: '4',
    title: 'Icon - True',
    description:
      '상단 닫기/타입 Icon - True인 경우입니다. icon props 값에 사용할 아이콘 이름을 설정하시면 됩니다.',
    showClose: false,
    icon: 'Blank' as IconName,
  },
];

export default function ModalSamplePage() {
  const [openStatus, setOpenStatus] = useState<Record<string, boolean>>({});

  const toggleModal = (id: string, isOpen: boolean) => {
    setOpenStatus((prev) => ({ ...prev, [id]: isOpen }));
  };

  return (
    <div className="p-10">
      <div className="mb-10">
        <h1 className="text-[40px] font-bold">Modal</h1>
        <p className="text-left text-base">
          모달은 사용자에게 중요한 정보를 제공하거나 특정 동작을 확인받을 때
          사용합니다.
        </p>
      </div>

      <div className="bg-[#F8F8F8] p-10 rounded-m space-y-10">
        {MODAL_SAMPLES.map((sample) => (
          <div key={sample.id} className="mb-5">
            <p className="font-medium text-slate-800">
              {sample.num}. {sample.description}
            </p>

            <pre className="my-3 p-4 bg-slate-50 border border-slate-200 rounded-md overflow-x-auto">
              <code className="text-sm font-mono text-slate-900">
                {`<CommonModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="${sample.title}"
  showClose={${sample.showClose}}${
    sample.icon
      ? `
  icon="${sample.icon}"`
      : ''
  }
>`}
              </code>
            </pre>

            <Button
              onClick={() => toggleModal(sample.id, true)}
              className="px-4 py-2 border rounded"
            >
              {sample.title}
            </Button>

            {/* 모달 컴포넌트 렌더링 */}
            <CommonModal
              isOpen={!!openStatus[sample.id]}
              onClose={() => toggleModal(sample.id, false)}
              title={sample.title}
              showClose={sample.showClose}
              size="md"
              icon={sample.icon}
            >
              <ModalBody>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </ModalBody>
              <ModalFooter>
                {/* TODO 공통 버튼 컴포넌트로 변경 필요
                이후 버튼 props 모달에서 어떻게 관리하면 좋을지 구상해야 함 */}
                <Button
                  variant="secondary"
                  className="flex-1 py-6 rounded-ms bg-[#E5E5E5]"
                >
                  Label
                </Button>
                <Button className="flex-1 py-6 rounded-ms">Label</Button>
              </ModalFooter>
            </CommonModal>
          </div>
        ))}
      </div>
    </div>
  );
}
