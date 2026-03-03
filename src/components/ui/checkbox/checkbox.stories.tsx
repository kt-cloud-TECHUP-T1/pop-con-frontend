import type { Meta, StoryObj } from '@storybook/nextjs';

import { Box } from '@/components/ui/box';
import { Checkbox } from './index';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    checked: {
      control: 'boolean',
    },
    defaultChecked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    isError: {
      control: 'boolean',
    },
    visualState: {
      control: 'select',
      options: ['default', 'hover', 'pressed'],
    },
    size: {
      control: {
        type: 'number',
        min: 16,
        max: 64,
        step: 4,
      },
    },
    onCheckedChange: {
      action: 'checkedChange',
    },
    className: {
      control: false,
    },
    style: {
      control: false,
    },
    asChild: {
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultChecked: false,
    disabled: false,
    isError: false,
    visualState: 'default',
    size: 20,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    size: 20,
  },
};

export const States: Story = {
  render: () => (
    <Box
      className="bg-[#F8F8F8] flex flex-wrap justify-center gap-10 py-16 px-10"
      radius="XL"
    >
      <div className="flex flex-col items-center gap-2">
        <Checkbox size={48} aria-label="default 상태 체크박스" />
        <span>default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox
          size={48}
          visualState="hover"
          aria-label="hover 상태 체크박스"
        />
        <span>hover</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox
          size={48}
          visualState="pressed"
          aria-label="pressed 상태 체크박스"
        />
        <span>pressed</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox size={48} isError aria-label="error 상태 체크박스" />
        <span>error</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox size={48} disabled aria-label="disabled 상태 체크박스" />
        <span>disabled</span>
      </div>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      {[16, 20, 24, 32, 48].map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Checkbox size={size} aria-label={`${size}px 체크박스`} />
          <span>{size}px</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
