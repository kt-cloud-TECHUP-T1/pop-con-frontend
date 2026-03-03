import type { Meta, StoryObj } from '@storybook/nextjs';

import { Button } from '@/components/ui/button';
import {
  Snackbar,
  SnackbarToaster,
  snackbar,
  type SnackbarVariant,
} from './index';

const meta: Meta<typeof Snackbar> = {
  title: 'UI/Snackbar',
  component: Snackbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: ['default', 'informative', 'alert', 'success', 'destructive'],
    },
    actionLabel: {
      control: 'text',
    },
    showCloseButton: {
      control: 'boolean',
    },
    hideStatusIcon: {
      control: 'boolean',
    },
    onAction: {
      action: 'action',
    },
    onClose: {
      action: 'close',
    },
    className: {
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const SNACKBAR_VARIANTS: SnackbarVariant[] = [
  'default',
  'informative',
  'alert',
  'success',
  'destructive',
];

function SnackbarFrame({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[24px] p-8">{children}</div>;
}

function VariantRow({
  title,
  buildProps,
}: {
  title: string;
  buildProps: (variant: SnackbarVariant) => React.ComponentProps<typeof Snackbar>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-[var(--content-medium)]">{title}</p>
      <div className="flex gap-4">
        {SNACKBAR_VARIANTS.map((variant) => (
          <Snackbar key={`${title}-${variant}`} {...buildProps(variant)} />
        ))}
      </div>
    </div>
  );
}

export const Default: Story = {
  args: {
    title: 'Title',
    variant: 'default',
    description: '',
    actionLabel: '',
    showCloseButton: false,
    hideStatusIcon: false,
  },
  render: (args) => (
    <SnackbarFrame>
      <Snackbar
        {...args}
        description={args.description || undefined}
        actionLabel={args.actionLabel || undefined}
      />
    </SnackbarFrame>
  ),
};

export const Default_: Story = {
  args: {
    title: 'Title',
    variant: 'default',
    description: '',
    actionLabel: '',
    showCloseButton: false,
    hideStatusIcon: false,
  },
  render: (args) => (
    <SnackbarFrame>
      <Snackbar
        {...args}
        description={args.description || undefined}
        actionLabel={args.actionLabel || undefined}
      />
    </SnackbarFrame>
  ),
};

export const SonnerPreview: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4 p-10">
      <SnackbarToaster />
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          variant="secondary"
          onClick={() =>
            snackbar.default({
              title: 'Title',
              showCloseButton: true,
            })
          }
        >
          Default
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            snackbar.informative({
              title: 'Title',
              description: 'Description',
              actionLabel: 'Label',
              showCloseButton: true,
            })
          }
        >
          Informative
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            snackbar.alert({
              title: 'Title',
              description: 'Description',
              showCloseButton: true,
            })
          }
        >
          Alert
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            snackbar.success({
              title: 'Title',
              actionLabel: '확인',
              showCloseButton: true,
            })
          }
        >
          Success
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            snackbar.destructive({
              title: 'Title',
              description: 'Description',
              actionLabel: '재시도',
              showCloseButton: true,
            })
          }
        >
          Destructive
        </Button>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const UISheet: Story = {
  render: () => (
    <SnackbarFrame>
      <div className="flex min-w-[2200px] flex-col gap-10">
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-[var(--content-high)]">
            Single Line
          </h3>
          <VariantRow
            title="Text Only"
            buildProps={(variant) => ({
              title: 'Title',
              variant,
            })}
          />
          <VariantRow
            title="Text Button"
            buildProps={(variant) => ({
              title: 'Title',
              variant,
              actionLabel: 'Label',
            })}
          />
          <VariantRow
            title="Icon Button"
            buildProps={(variant) => ({
              title: 'Title',
              variant,
              showCloseButton: true,
            })}
          />
          <VariantRow
            title="Text Button + Icon Button"
            buildProps={(variant) => ({
              title: 'Title',
              variant,
              actionLabel: 'Label',
              showCloseButton: true,
            })}
          />
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-[var(--content-high)]">
            Two Line
          </h3>
          <VariantRow
            title="Text Only"
            buildProps={(variant) => ({
              title: 'Title',
              description: 'Description',
              variant,
            })}
          />
          <VariantRow
            title="Text Button"
            buildProps={(variant) => ({
              title: 'Title',
              description: 'Description',
              variant,
              actionLabel: 'Label',
            })}
          />
          <VariantRow
            title="Icon Button"
            buildProps={(variant) => ({
              title: 'Title',
              description: 'Description',
              variant,
              showCloseButton: true,
            })}
          />
          <VariantRow
            title="Text Button + Icon Button"
            buildProps={(variant) => ({
              title: 'Title',
              description: 'Description',
              variant,
              actionLabel: 'Label',
              showCloseButton: true,
            })}
          />
        </section>
      </div>
    </SnackbarFrame>
  ),
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
};
