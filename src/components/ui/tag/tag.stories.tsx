import type { Meta, StoryObj } from '@storybook/nextjs';
import { Tag } from './index';

const meta: Meta<typeof Tag> = {
  title: 'UI/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    color: {
      control: 'select',
      options: ['gray', 'red', 'orange', 'blue', 'green'],
    },
    size: {
      control: 'select',
      options: ['large', 'medium', 'small'],
    },
    label: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    tone: 'primary',
    color: 'orange',
    size: 'medium',
    label: 'Label',
  },
};

export const Primary: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <Tag tone="primary" color="gray" size="large" label="Label" />
        <Tag tone="primary" color="red" size="large" label="Label" />
        <Tag tone="primary" color="orange" size="large" label="Label" />
        <Tag tone="primary" color="blue" size="large" label="Label" />
        <Tag tone="primary" color="green" size="large" label="Label" />
      </div>
      <div className="flex gap-3">
        <Tag tone="primary" color="gray" size="medium" label="Label" />
        <Tag tone="primary" color="red" size="medium" label="Label" />
        <Tag tone="primary" color="orange" size="medium" label="Label" />
        <Tag tone="primary" color="blue" size="medium" label="Label" />
        <Tag tone="primary" color="green" size="medium" label="Label" />
      </div>
      <div className="flex gap-3">
        <Tag tone="primary" color="gray" size="small" label="Label" />
        <Tag tone="primary" color="red" size="small" label="Label" />
        <Tag tone="primary" color="orange" size="small" label="Label" />
        <Tag tone="primary" color="blue" size="small" label="Label" />
        <Tag tone="primary" color="green" size="small" label="Label" />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Secondary: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <Tag tone="secondary" color="gray" size="large" label="Label" />
        <Tag tone="secondary" color="red" size="large" label="Label" />
        <Tag tone="secondary" color="orange" size="large" label="Label" />
        <Tag tone="secondary" color="blue" size="large" label="Label" />
        <Tag tone="secondary" color="green" size="large" label="Label" />
      </div>
      <div className="flex gap-3">
        <Tag tone="secondary" color="gray" size="medium" label="Label" />
        <Tag tone="secondary" color="red" size="medium" label="Label" />
        <Tag tone="secondary" color="orange" size="medium" label="Label" />
        <Tag tone="secondary" color="blue" size="medium" label="Label" />
        <Tag tone="secondary" color="green" size="medium" label="Label" />
      </div>
      <div className="flex gap-3">
        <Tag tone="secondary" color="gray" size="small" label="Label" />
        <Tag tone="secondary" color="red" size="small" label="Label" />
        <Tag tone="secondary" color="orange" size="small" label="Label" />
        <Tag tone="secondary" color="blue" size="small" label="Label" />
        <Tag tone="secondary" color="green" size="small" label="Label" />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
