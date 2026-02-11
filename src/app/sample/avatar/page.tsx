'use client';

import { Avatar } from '@/components/common/CommonAvatar';
import { AvatarEditable } from '@/components/common/CommonAvatarEditable';
import { RADIUS } from '@/constants/design-system';
import type { AvatarSizeType } from '@/constants/design-system';

const AVATAR_SIZES: Array<{
  key: AvatarSizeType;
  label: string;
  iconSize: number;
  pixel: string;
}> = [
  { key: 'XS', label: 'Extra Small', iconSize: 12.5, pixel: '20×20' },
  { key: 'SM', label: 'Small', iconSize: 15, pixel: '24×24' },
  { key: 'MD', label: 'Medium', iconSize: 20, pixel: '32×32' },
  { key: 'LG', label: 'Large', iconSize: 20, pixel: '40×40' },
  { key: 'XL', label: 'Extra Large', iconSize: 24, pixel: '48×48' },
  { key: 'XL2', label: '2X Large', iconSize: 36, pixel: '72×72' },
  { key: 'XL3', label: '3X Large', iconSize: 44, pixel: '88×88' },
];

export default function CommonAvatarSamplePage() {
  return (
    <div className="p-10">
      <div className="mb-10">
        <h1 className="text-[40px] font-bold">Avatar</h1>
        <p className="text-left text-base">
          사용자를 시각적으로 나타내는 아바타 컴포넌트입니다.
        </p>
      </div>

      {/* 기본 아바타 */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-8">기본 아바타</h2>
        <div className={`${RADIUS.XL3} bg-white p-20 border border-gray-200`}>
          {/* 아이콘 아바타 */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-6 text-gray-700">아이콘</h3>
            <div className="flex gap-6 items-end">
              {AVATAR_SIZES.map(({ key, iconSize, pixel }) => (
                <div key={key} className="flex flex-col items-center gap-2">
                  <Avatar
                    icon={{
                      name: 'PersonFill',
                      color: 'white',
                      size: iconSize,
                    }}
                    size={key}
                  />
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-900">{key}</p>
                    <p className="text-xs text-gray-500">{pixel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 이미지 아바타 */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-700">이미지</h3>
            <div className="flex gap-6 items-end">
              {AVATAR_SIZES.map(({ key, pixel }) => (
                <div key={key} className="flex flex-col items-center gap-2">
                  <Avatar src="/images/temp/God-Sang-hyeok.png" size={key} />
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-900">{key}</p>
                    <p className="text-xs text-gray-500">{pixel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 편집 아바타 */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-8">편집 가능한 아바타</h2>
        <div className={`${RADIUS.XL3} bg-white p-20 border border-gray-200`}>
          <div className="mb-12">
            <div className="flex gap-6 items-center">
              <AvatarEditable
                icon={{
                  name: 'PersonFill',
                  color: 'white',
                  size: 36,
                }}
                onEdit={() => alert('아바타 편집')}
                size="XL2"
              />
              <AvatarEditable
                icon={{
                  name: 'PersonFill',
                  color: 'white',
                  size: 44,
                }}
                onEdit={() => alert('아바타 편집')}
                size="XL3"
              />
            </div>
          </div>
          <div>
            <div className="flex gap-6 items-center">
              <AvatarEditable
                src="/images/temp/God-Sang-hyeok.png"
                onEdit={() => alert('아바타 편집')}
                size="XL2"
              />
              <AvatarEditable
                src="/images/temp/God-Sang-hyeok.png"
                onEdit={() => alert('아바타 편집')}
                size="XL3"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 사용 방법 */}
      <div>
        <h2 className="text-2xl font-bold mb-8">사용 방법</h2>
        <pre className="p-4 bg-slate-50 border border-slate-200 rounded-md overflow-x-auto">
          <code className="text-sm font-mono text-slate-900">
            {`import { Avatar } from '@/components/common/CommonAvatar';
import { AvatarEditable } from '@/components/common/CommonAvatarEditable';

// 1. 기본 아이콘 아바타
<Avatar size="MD" />

// 2. 커스텀 아이콘 아바타
<Avatar
  icon={{ name: 'PersonFill', color: 'white', size: 20 }}
  size="MD"
/>

// 3. 이미지 아바타
<Avatar 
  src="/images/user.png" 
  size="LG" 
  alt="사용자 이름"
/>

// 4. 편집 가능한 아바타
<AvatarEditable
  src="/images/user.png"
  size="XL2"
  onEdit={() => {
    // 편집 로직
  }}
/>`}
          </code>
        </pre>
      </div>
    </div>
  );
}
