import { Meta, StoryObj } from '@storybook/nextjs';

import { Box } from './box';

const meta: Meta<typeof Box> = {
  title: 'UI/Box',
  component: Box,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Box>;

export const Defaault: Story = {
  args: {},
};
