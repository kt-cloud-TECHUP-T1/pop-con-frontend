import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { Button } from '@/components/ui/button';
import Modal, { type ModalProps, ModalBody, ModalFooter } from './index';

const meta = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    radius: {
      control: 'select',
      options: ['NONE', 'XXS', 'XS', 'S', 'MS', 'M', 'ML', 'LG', 'XL', '_2XL', '_3XL', 'FULL'],
    },
    showClose: { control: 'boolean' },
    icon: {
      control: 'text',
      description: 'Icon 컴포넌트 이름입니다.',
    },
    iconSize: {
      control: {
        type: 'number',
        min: 16,
        max: 96,
        step: 4,
      },
    },
    iconClassName: { control: 'text' },
    isOpen: { table: { disable: true } },
    onClose: { action: 'close' },
    className: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;
type ModalStoryArgs = Omit<ModalProps, 'isOpen' | 'onClose' | 'children'>;

function ModalExample({
  triggerLabel,
  ...args
}: ModalStoryArgs & { triggerLabel: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Button onClick={() => setOpen(true)}>{triggerLabel}</Button>
      <Modal {...args} isOpen={open} onClose={() => setOpen(false)}>
        <SampleContent />
      </Modal>
    </div>
  );
}

function SampleContent() {
  return (
    <>
      <ModalBody>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </ModalBody>
      <ModalFooter>
        <Button
          variant="secondary"
          className="flex-1 py-6 rounded-ms bg-[#E5E5E5]"
        >
          Label
        </Button>
        <Button className="flex-1 py-6 rounded-ms">Label</Button>
      </ModalFooter>
    </>
  );
}

function createSampleStory(
  triggerLabel: string,
  args: ModalStoryArgs
): Story {
  return {
    args: {
      ...args,
      isOpen: false,
      onClose: () => undefined,
      children: null,
    },
    render: ({ isOpen: _isOpen, onClose: _onClose, children: _children, ...storyArgs }) => (
      <ModalExample {...storyArgs} triggerLabel={triggerLabel} />
    ),
  };
}

export const NormalFalse = createSampleStory('Normal - False', {
  title: 'Normal - False',
  showClose: false,
  size: 'md',
});

export const NormalTrue = createSampleStory('Normal - True', {
  title: 'Normal - True',
  showClose: true,
  size: 'md',
});

export const IconFalse = createSampleStory('Icon - False', {
  title: 'Icon - False',
  showClose: true,
  size: 'md',
  icon: 'Blank',
});

export const IconTrue = createSampleStory('Icon - True', {
  title: 'Icon - True',
  showClose: false,
  size: 'md',
  icon: 'Blank',
});
