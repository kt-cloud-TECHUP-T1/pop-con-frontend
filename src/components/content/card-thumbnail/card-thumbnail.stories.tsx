import type { Meta, StoryObj } from '@storybook/nextjs';
import { CardThumbnail } from './index';

const meta: Meta<typeof CardThumbnail> = {
  title: 'Content/CardThumbnail',
  component: CardThumbnail,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    thumbnailRatio: {
      control: 'select',
      options: ['1/1', '3/4', '16/9'],
      description: '썸네일 이미지의 비율을 지정합니다.',
    },
    title: { control: 'text' },
    label: { control: 'text' },
    description: { control: 'text' },
    caption: { control: 'text' },
    countView: { control: 'number' },
    countLike: { control: 'number' },
    showButtonLike: { control: 'boolean' },
    showCountView: { control: 'boolean' },
    showCountLike: { control: 'boolean' },
    isLiked: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof CardThumbnail>;

export const Default: Story = {
  args: {
    thumbnailUrl: '/images/temp/God-Sang-hyeok.png',
    thumbnailRatio: '3/4',
    title: '페이커 (Faker)',
    label: 'T1',
    description: '리그 오브 레전드 프로게이머',
    caption: '미드 라이너',
    countView: 1542,
    countLike: 999,
    showButtonLike: true,
    showCountView: true,
    showCountLike: true,
    isLiked: false,
  },
  render: (args) => (
    <div className="w-[280px]">
      <CardThumbnail {...args} />
    </div>
  ),
};

export const ThumbnailRatios: Story = {
  args: {
    thumbnailUrl: '/images/temp/God-Sang-hyeok.png',
    showButtonLike: true,
  },
  render: (args) => (
    <div className="flex gap-6 items-start">
      <div className="w-[200px]">
        <CardThumbnail
          {...args}
          thumbnailRatio="1/1"
          title="1/1 비율 (Square)"
        />
      </div>
      <div className="w-[200px]">
        <CardThumbnail {...args} thumbnailRatio="3/4" title="3/4 비율" />
      </div>
      <div className="w-[200px]">
        <CardThumbnail
          {...args}
          thumbnailRatio="16/9"
          title="16/9 비율 (Video)"
        />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
