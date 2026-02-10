import { Icon } from '@/components/Icon/Icon';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/iconButton';
import { Typography } from '@/components/ui/typography';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-5">
      <Button leftIcon={<Icon name="Blank" size={20}></Icon>} variant="primary">
        primary
      </Button>
      <Button
        leftIcon={<Icon name="Blank" size={20}></Icon>}
        variant="secondary"
        disabled
      >
        secondary
      </Button>
      <Button
        size="xsmall"
        leftIcon={<Icon name="Blank" size={20}></Icon>}
        variant="tertiary"
        disabled
      >
        tertiary
      </Button>
      <Button
        leftIcon={<Icon name="Blank" size={20}></Icon>}
        variant="destructive"
      >
        destructive
      </Button>
      <Button leftIcon={<Icon name="Blank" size={20}></Icon>} variant="ghost">
        ghost
      </Button>

      <IconButton
        variant="primary"
        size="medium"
        icon="Blank"
        ariaLabel="닫기"
        // disabled
      />

      <IconButton
        // disabled
        variant="secondary"
        size="medium"
        icon="Blank"
        ariaLabel="검색"
      />
      <IconButton
        // disabled
        variant="tertiary"
        size="medium"
        icon="Blank"
        ariaLabel="검색"
      />
      <IconButton
        // disabled
        variant="destructive"
        size="medium"
        icon="Blank"
        ariaLabel="검색"
      />
    </div>
  );
}
