import type { Meta, StoryObj } from '@storybook/nextjs';
import { CardOverlay } from './index';

const meta: Meta<typeof CardOverlay> = {
  title: 'Content/CardOverlay',
  component: CardOverlay,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    thumbnailRatio: {
      control: 'select',
      options: ['3/4', '16/9'],
      description: '썸네일 이미지의 비율을 지정합니다.',
    },
    title: { control: 'text' },
    description: { control: 'text' },
    caption: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof CardOverlay>;

export const Default: Story = {
  args: {
    thumbnailUrl: '/images/temp/God-Sang-hyeok.png',
    thumbnailRatio: '3/4',
    title: '오버레이 카드 배너',
    description: '이미지 위에 텍스트가 그라데이션과 함께 표시됩니다.',
    caption: '하단 캡션',
  },
  render: (args) => (
    <div className="w-[320px]">
      <CardOverlay {...args} />
    </div>
  ),
};

export const OverlayRatios: Story = {
  args: {
    thumbnailUrl: '/images/temp/God-Sang-hyeok.png',
  },
  render: (args) => (
    <div className="flex gap-6 items-start">
      <div className="w-[280px]">
        <CardOverlay
          {...args}
          thumbnailRatio="3/4"
          title="3/4 비율 (포스터)"
          description="주로 세로형 콘텐츠에 어울리는 비율입니다."
        />
      </div>
      <div className="w-[400px]">
        <CardOverlay
          {...args}
          thumbnailRatio="16/9"
          title="16/9 비율 (비디오)"
          description="가로형 영상 썸네일 등에 적합합니다."
        />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
