'use client';
import { Icon } from '@/components/Icon/Icon';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/iconButton';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/textArea';
import { Typography } from '@/components/ui/typography';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [value, setValue] = useState('');

  const state =
    value.length === 0 ? 'default' : value.includes('@') ? 'positive' : 'error';

  return (
    <div>
      {/* <Input
        label="label"
        placeholder="이메일 입력"
        required
        value={value}
        inputSize="large"
        state={state}
        onChange={(e) => setValue(e.target.value)}
        messages={{
          default: '회사 이메일을 입력해주세요',
          error: '에러임',
          positive: '긍정',
          disabled: 'dis',
        }}
      /> */}

      <TextArea
        label="설명"
        required
        placeholder="내용을 입력해주세요"
        state={state}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        messages={{
          default: '내용을 작성해주세요.',
          error: '잘못 입력하였습니다. ',
          positive: '제출 가능',
          disabled: '입력 불가능합니다.',
        }}
      />
    </div>
  );
}
