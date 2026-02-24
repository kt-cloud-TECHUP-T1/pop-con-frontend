import type { Meta, StoryObj } from '@storybook/nextjs';
// import { fn } from 'storybook/test';

import { Avatar } from './avatar';
import { AvatarEditable } from './avatar-editable';
import type { AvatarSizeType } from '@/constants/design-system';
import { IconName } from '../Icon/Icon';

const AVATAR_SIZES: Array<{
  key: AvatarSizeType;
  pixel: string;
  iconSize: number;
}> = [
  { key: 'XS', pixel: '20x20', iconSize: 12.5 },
  { key: 'SM', pixel: '24x24', iconSize: 15 },
  { key: 'MD', pixel: '32x32', iconSize: 20 },
  { key: 'LG', pixel: '40x40', iconSize: 20 },
  { key: 'XL', pixel: '48x48', iconSize: 24 },
  { key: '_2XL', pixel: '72x72', iconSize: 36 },
  { key: '_3XL', pixel: '88x88', iconSize: 44 },
];

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['XS', 'SM', 'MD', 'LG', 'XL', '_2XL', '_3XL'],
      description: '아바타의 크기를 결정합니다.',
    },
    src: {
      control: 'text',
      description: '이미지 경로입니다.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

type AvatarPlaygroundArgs = {
  size: AvatarSizeType;
  src?: string;
  iconName: IconName;
  iconSize: number;
};

export const Default: StoryObj<AvatarPlaygroundArgs> = {
  args: {
    size: 'MD',
    src: '/images/temp/God-Sang-hyeok.png',
    iconName: 'PersonFill',
    iconSize: 20,
  },
  argTypes: {
    iconName: {
      control: 'select',
      options: ['PersonFill', 'Pencil', 'HeartFill'],
    },
    iconSize: {
      control: {
        type: 'number',
        min: 8,
        max: 48,
        step: 1,
      },
    },
  },
  render: (args) => (
    <div className="flex gap-3">
      <Avatar
        size={args.size}
        icon={{
          name: args.iconName,
          className: 'text-black',
          size: args.iconSize,
        }}
      />
      <Avatar size={args.size} src={args.src} />
    </div>
  ),
};

export const IconAvartarSizes: Story = {
  render: () => (
    <div className="flex gap-6 items-end">
      {AVATAR_SIZES.map(({ key, pixel, iconSize }) => (
        <div key={key} className="flex flex-col items-center gap-2">
          <Avatar
            icon={{
              name: 'PersonFill',
              className: 'text-black',
              size: iconSize,
            }}
            size={key}
          />
          <div className="text-center">
            <p className="text-xs font-medium text-gray-900">{key}</p>
            <p className="text-xs text-gray-500">{pixel}</p>
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const ImageAvatarSizes: Story = {
  render: () => (
    <div className="flex gap-6 items-end">
      {AVATAR_SIZES.map(({ key, pixel }) => (
        <div key={key} className="flex flex-col items-center gap-2">
          <Avatar src="/images/temp/God-Sang-hyeok.png" size={key} />
          <div className="text-center">
            <p className="text-xs font-medium text-gray-900">{key}</p>
            <p className="text-xs text-gray-500">{pixel}</p>
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const EditableAvatar: Story = {
  render: () => (
    <div className="flex gap-6 items-center">
      <AvatarEditable
        icon={{
          name: 'PersonFill',
          className: 'text-black',
          size: 36,
        }}
        onEdit={() => alert('아바타 편집1')}
        size="_2XL"
      />
      <AvatarEditable
        src="/images/temp/God-Sang-hyeok.png"
        onEdit={() => alert('아바타 편집2')}
        size="_3XL"
      />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
