import type { Meta, StoryObj } from '@storybook/nextjs';

import { Progress } from './index';

const meta = {
  title: 'UI/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    value: 40,
    min: 0,
    max: 100,
    minVisualPercent: 0,
  },
  argTypes: {
    value: {
      control: {
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
      },
    },
    min: {
      control: {
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
      },
    },
    max: {
      control: {
        type: 'number',
        min: 1,
        max: 200,
        step: 1,
      },
    },
    minVisualPercent: {
      control: {
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
      },
    },
    className: { control: false },
    trackClassName: { control: false },
    fillClassName: { control: false },
  },
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[320px]">
      <Progress {...args} />
    </div>
  ),
};

export const QueueStyle: Story = {
  args: {
    value: 5,
    minVisualPercent: 8,
  },
  render: (args) => (
    <div className="w-[420px]">
      <Progress {...args} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="w-[420px] space-y-5">
      <Progress value={0} />
      <Progress value={35} />
      <Progress value={70} />
      <Progress value={100} />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
