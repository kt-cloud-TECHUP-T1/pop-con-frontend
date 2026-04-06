import type { Meta, StoryObj } from '@storybook/nextjs';

import { Box } from './index';

const meta: Meta<typeof Box> = {
  title: 'UI/Box',
  component: Box,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'section', 'button'],
      description: '렌더링할 HTML 요소를 지정합니다.',
    },
    radius: {
      control: 'select',
      options: ['NONE', 'XXS', 'XS', 'S', 'MS', 'M', 'ML', 'LG', 'XL', '_2XL', '_3XL', 'FULL'],
    },
    shadow: {
      control: 'select',
      options: ['S', 'M', 'L', 'XL'],
    },
    border: {
      control: 'select',
      options: ['NONE', 'SUBTLE', 'DEFAULT', 'STRONG', 'STRONG_2'],
      description: '디자인 토큰 또는 사용자 정의 색상 문자열을 전달할 수 있습니다.',
    },
    background: {
      control: 'select',
      options: ['TRANSPARENT', 'DEFAULT', 'STRONG'],
    },
    padding: {
      control: 'select',
      options: ['NONE', '_2XS', 'XS', 'S', 'MS', 'M', 'ML', 'L', 'XL', '_2XL', '_3XL'],
    },
    paddingX: {
      control: 'select',
      options: ['NONE', '_2XS', 'XS', 'S', 'MS', 'M', 'ML', 'L', 'XL', '_2XL', '_3XL'],
    },
    paddingY: {
      control: 'select',
      options: ['NONE', '_2XS', 'XS', 'S', 'MS', 'M', 'ML', 'L', 'XL', '_2XL', '_3XL'],
    },
    children: {
      control: 'text',
    },
    className: {
      control: false,
    },
    style: {
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Box>;

export const Default: Story = {
  args: {
    as: 'div',
    radius: 'M',
    shadow: 'M',
    border: 'DEFAULT',
    background: 'DEFAULT',
    padding: 'MS',
    children: '기본 Box',
  },
  render: (args) => <Box {...args} className="min-w-[180px]" />,
};

export const AsButton: Story = {
  args: {
    as: 'button',
    radius: 'FULL',
    border: 'STRONG',
    background: 'DEFAULT',
    paddingX: 'ML',
    paddingY: 'S',
    children: '버튼처럼 사용',
    type: 'button',
  },
  render: (args) => <Box {...args} />,
};

export const CustomBorderColor: Story = {
  args: {
    radius: 'LG',
    border: '#22c55e',
    background: 'TRANSPARENT',
    padding: 'M',
    children: '사용자 정의 border 색상',
  },
  render: (args) => <Box {...args} className="min-w-[220px]" />,
};

export const TokenShowcase: Story = {
  render: () => (
    <div className="flex flex-col gap-4 min-w-[320px]">
      <Box background="DEFAULT" border="SUBTLE" padding="S" radius="S">
        Subtle border / small radius
      </Box>
      <Box background="DEFAULT" border="DEFAULT" padding="MS" radius="M" shadow="S">
        Default surface
      </Box>
      <Box background="STRONG" border="STRONG_2" padding="ML" radius="XL" shadow="L">
        Strong emphasis
      </Box>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
