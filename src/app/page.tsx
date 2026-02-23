'use client';

import { useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import Modal, { ModalBody, ModalFooter } from '@/components/ui/modal';
import { Box } from '@/components/ui/box';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="p-8 space-y-12 bg-gray-50 min-h-screen">
      <section className="space-y-4">
        <Typography variant="display-1" weight="bold">
          UI Component Test Page
        </Typography>
        <Typography variant="body-1">
          이 페이지는 현재 구현된 UI 컴포넌트들을 테스트하기 위한 공간입니다.
        </Typography>
      </section>

      {/* Typography Section */}
      <section className="space-y-4 p-6 bg-white rounded-lg shadow-sm">
        <Typography variant="heading-1" weight="bold" className="border-b pb-2">
          1. Typography
        </Typography>
        <div className="space-y-2">
          <Typography variant="display-1">Display 1 (Regular)</Typography>
          <Typography variant="display-2" weight="medium">
            Display 2 (Medium)
          </Typography>
          <Typography variant="heading-1" weight="bold">
            Heading 1 (Bold)
          </Typography>
          <Typography variant="heading-2">Heading 2</Typography>
          <Typography variant="title-1">Title 1</Typography>
          <Typography variant="title-2">Title 2</Typography>
          <Typography variant="body-1">
            Body 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>
          <Typography variant="body-2">
            Body 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>
          <div className="flex gap-4">
            <Typography variant="label-1">Label 1</Typography>
            <Typography variant="label-2">Label 2</Typography>
            <Typography variant="label-3">Label 3</Typography>
          </div>
          <div className="flex gap-4">
            <Typography variant="caption-1">Caption 1</Typography>
            <Typography variant="caption-2">Caption 2</Typography>
          </div>
        </div>
      </section>

      {/* Button Section */}
      <section className="space-y-4 p-6 bg-white rounded-lg shadow-sm">
        <Typography variant="heading-1" weight="bold" className="border-b pb-2">
          2. Button
        </Typography>
        <div className="space-y-6">
          <div className="space-y-2">
            <Typography variant="title-2">Variants</Typography>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Typography variant="title-2">Sizes</Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="large">Large</Button>
              <Button size="medium">Medium</Button>
              <Button size="small">Small</Button>
              <Button size="xsmall">XSmall</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Typography variant="title-2">States</Typography>
            <div className="flex flex-wrap gap-4">
              <Button disabled>Disabled</Button>
              <Button variant="secondary" disabled>
                Disabled Secondary
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Input Section */}
      <section className="space-y-4 p-6 bg-white rounded-lg shadow-sm">
        <Typography variant="heading-1" weight="bold" className="border-b pb-2">
          3. Input
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Default Input"
            placeholder="Type something..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Input
            label="Input with Suffix"
            placeholder="Search..."
            suffix="Search"
          />
          <Input
            label="Error State"
            state="error"
            messages={{ error: 'This is an error message.' }}
            placeholder="Invalid input"
          />
          <Input
            label="Disabled State"
            disabled
            placeholder="Cannot type here"
          />
        </div>
      </section>

      {/* Checkbox & Avatar Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 p-6 bg-white rounded-lg shadow-sm">
          <Typography
            variant="heading-1"
            weight="bold"
            className="border-b pb-2"
          >
            4. Checkbox
          </Typography>
          <div className="flex items-center gap-4">
            <Checkbox
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(checked === true)}
              id="test-checkbox"
            />
            <label htmlFor="test-checkbox">
              <Typography variant="body-1">
                Toggle me: {isChecked ? 'Checked' : 'Unchecked'}
              </Typography>
            </label>
          </div>
          <div className="flex items-center gap-4">
            <Checkbox isError id="error-checkbox" />
            <label htmlFor="error-checkbox">
              <Typography variant="body-1">Error state checkbox</Typography>
            </label>
          </div>
          <div className="flex items-center gap-4">
            <Checkbox disabled id="disabled-checkbox" />
            <label htmlFor="disabled-checkbox">
              <Typography variant="body-1">Disabled checkbox</Typography>
            </label>
          </div>
        </div>

        <div className="space-y-4 p-6 bg-white rounded-lg shadow-sm">
          <Typography
            variant="heading-1"
            weight="bold"
            className="border-b pb-2"
          >
            5. Avatar
          </Typography>
          <div className="flex flex-wrap items-end gap-6">
            <div className="text-center space-y-2">
              <Avatar size="XL" />
              <Typography variant="caption-1">XL</Typography>
            </div>
            <div className="text-center space-y-2">
              <Avatar size="LG" src="/next.svg" />
              <Typography variant="caption-1">LG (Image)</Typography>
            </div>
            <div className="text-center space-y-2">
              <Avatar size="MD" />
              <Typography variant="caption-1">MD</Typography>
            </div>
            <div className="text-center space-y-2">
              <Avatar size="SM" />
              <Typography variant="caption-1">SM</Typography>
            </div>
            <div className="text-center space-y-2">
              <Avatar size="XS" />
              <Typography variant="caption-1">XS</Typography>
            </div>
          </div>
        </div>
      </section>

      {/* IconButton & Modal Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 p-6 bg-white rounded-lg shadow-sm">
          <Typography
            variant="heading-1"
            weight="bold"
            className="border-b pb-2"
          >
            6. IconButton
          </Typography>
          <div className="flex flex-wrap gap-4">
            <IconButton
              icon="Bell"
              ariaLabel="Notifications"
              variant="primary"
            />
            <IconButton icon="Search" ariaLabel="Search" variant="secondary" />
            <IconButton icon="Pencil" ariaLabel="Edit" variant="tertiary" />
            <IconButton icon="Close" ariaLabel="Delete" variant="destructive" />
          </div>
        </div>

        <div className="space-y-4 p-6 bg-white rounded-lg shadow-sm">
          <Typography
            variant="heading-1"
            weight="bold"
            className="border-b pb-2"
          >
            7. Modal
          </Typography>
          <Button onClick={() => setIsModalOpen(true)}>Open Test Modal</Button>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Test Modal Title"
            icon="CircleCheckFill"
            iconClassName="text-green-500"
          >
            <ModalBody>
              This is a test modal to verify that the Modal component and its
              underlying Dialog primitive are working correctly.
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Confirm
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </section>

      {/* Box Section */}
      <section className="space-y-4 p-6 bg-white rounded-lg shadow-sm">
        <Typography variant="heading-1" weight="bold" className="border-b pb-2">
          8. Box (Layout Primitives)
        </Typography>
        <div className="flex gap-4">
          <Box radius="M" shadow="M" className="p-8 bg-blue-50">
            <Typography variant="body-2">
              Box with Radius MD & Shadow MD
            </Typography>
          </Box>
          <Box radius="LG" shadow="L" className="p-8 bg-red-50">
            <Typography variant="body-2">
              Box with Radius LG & Shadow LG
            </Typography>
          </Box>
          <Box
            radius="FULL"
            className="w-32 h-32 bg-green-50 flex items-center justify-center border"
          >
            <Typography variant="caption-1">Circle Box</Typography>
          </Box>
        </div>
      </section>
    </main>
  );
}
