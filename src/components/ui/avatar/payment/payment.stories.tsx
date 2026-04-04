import type { Meta, StoryObj } from '@storybook/nextjs';
import type { AvatarSizeType } from '@/constants/design-system';

import { PaymentAvatar } from './index';

const BRAND_CODES = [
  '하나카드',
  '현대카드',
  'KB국민카드',
  '케이뱅크',
  '신한카드',
  '우리카드',
];
const SIZES: AvatarSizeType[] = ['XS', 'SM', 'MD', 'LG', 'XL', '_2XL', '_3XL'];

const meta: Meta<typeof PaymentAvatar> = {
  title: 'UI/Avatar/Payment',
  component: PaymentAvatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    brandCode: {
      control: 'select',
      options: [...BRAND_CODES, undefined],
      description: '카드사 코드',
    },
    size: {
      control: 'select',
      options: SIZES,
      description: '아바타 크기 (AvatarSizeType)',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    brandCode: '신한카드',
    size: 'LG',
  },
};

export const AllBrands: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <p className="text-sm font-medium capitalize">{size}</p>
          <div className="flex gap-3 items-center">
            {BRAND_CODES.map((code) => (
              <div key={code} className="flex flex-col items-center gap-1">
                <PaymentAvatar brandCode={code} size={size} />
                <p className="text-xs text-[var(--content-extra-low)]">
                  {code}
                </p>
              </div>
            ))}
            <div className="flex flex-col items-center gap-1">
              <PaymentAvatar size={size} />
              <p className="text-xs text-[var(--content-extra-low)]">
                fallback
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Fallback: Story = {
  args: {
    brandCode: undefined,
    size: 'XL',
  },
};
