'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon/Icon';
import { PageHeader } from '@/components/shared/page-header';
import { CardThumbnail } from '@/components/content/card-thumbnail';
import { Typography } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/text-area';
import { Button } from '@/components/ui/button';
import { ThumbnailImage } from '@/components/content/thumbnail-image';
import { snackbar } from '@/components/ui/snackbar';

const MOCK_POPUP = {
  thumbnailUrl: undefined as string | undefined,
  title: 'Title',
  description: 'Sub Text',
  caption: 'Caption',
};

function InteractiveStarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => {
        const starIndex = i + 1;
        const isFilled = hovered ? starIndex <= hovered : starIndex <= value;
        return (
          <button
            key={i}
            type="button"
            className="cursor-pointer"
            onMouseEnter={() => setHovered(starIndex)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(starIndex)}
            aria-label={`별점 ${starIndex}점`}
          >
            <Icon
              name="StarFill"
              size={36}
              className={
                isFilled
                  ? 'text-[var(--btn-primary-default)]'
                  : 'text-[var(--btn-primary-disabled)]'
              }
            />
          </button>
        );
      })}
    </div>
  );
}

function ImagePreviewGrid({
  images,
  onRemove,
}: {
  images: string[];
  onRemove: (index: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {images.map((src, i) => (
        <div key={i} className="relative">
          <ThumbnailImage
            src={src || undefined}
            alt={`리뷰 이미지 ${i + 1}`}
            width={200}
            height={200}
          />
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors cursor-pointer shadow-sm"
            aria-label={`이미지 ${i + 1} 삭제`}
          >
            <Icon
              name="Close"
              size={14}
              className="text-[var(--content-high)]"
            />
          </button>
        </div>
      ))}
    </div>
  );
}

// TODO: 실제 API 연동 시 bidId로 해당 입찰 정보 fetch
export default function ReviewNewPage({
  searchParams,
}: {
  searchParams: { bidId?: string };
}) {
  // searchParams.bidId는 API 연동 시 사용
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const imagesRef = useRef<string[]>(images);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지가 변경될 떄마다 Ref 업데이트
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // 컴포넌트 언마운트 시 모든 Blob URL 해제
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const handleRemoveImage = (index: number) => {
    const urlToRemove = images[index];
    // 삭제할 때도 blob URL인 경우에만 해제
    if (urlToRemove && urlToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRemove);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...urls]);
    e.target.value = '';
  };

  const handleSave = () => {
    // TODO: 실제 API 연동
    snackbar.success({ title: '리뷰가 작성되었습니다.' });
    router.back();
  };

  return (
    <section>
      <PageHeader
        title="리뷰 작성"
        titleVariant="heading-1"
        titleWeight="bold"
      />

      <div className="mt-8 flex flex-col gap-8">
        {/* 팝업 썸네일 */}
        <div className="w-[140px]">
          <CardThumbnail
            thumbnailUrl={MOCK_POPUP.thumbnailUrl}
            thumbnailRatio="3/4"
            title={MOCK_POPUP.title}
            description={MOCK_POPUP.description}
            caption={MOCK_POPUP.caption}
          />
        </div>

        {/* 별점 */}
        <div className="flex flex-col gap-3">
          <Typography
            variant="title-2"
            weight="medium"
            className="text-[var(--content-high)]"
          >
            이번 팝업, 어땠나요?
          </Typography>
          <InteractiveStarRating value={rating} onChange={setRating} />
        </div>

        <div className="flex flex-col gap-4">
          {/* 제목 입력 */}
          <Input
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            inputSize="medium"
          />

          {/* 본문 입력 */}
          <TextArea
            placeholder="팝업스토어에서의 경험을 자세하게 들려주세요"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            textAreaSize="large"
            className="min-h-[160px]"
          />
        </div>

        {/* 이미지 */}
        <div className="flex flex-col gap-4">
          <ImagePreviewGrid images={images} onRemove={handleRemoveImage} />

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAddImage}
            />
            <Button
              type="button"
              variant="tertiary"
              size="large"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1"
            >
              <Icon name="Plus" size={20} />
              이미지 추가
            </Button>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center gap-3 mt-4">
          <Button
            type="button"
            variant="secondary"
            size="large"
            className="w-full max-w-[200px]"
            onClick={() => router.back()}
          >
            취소
          </Button>
          <Button
            type="button"
            size="large"
            className="w-full max-w-[200px]"
            onClick={handleSave}
          >
            저장
          </Button>
        </div>
      </div>
    </section>
  );
}
