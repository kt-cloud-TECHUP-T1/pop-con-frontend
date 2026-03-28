'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon/Icon';
import { PageHeader } from '@/components/shared/page-header';
import { CardThumbnail } from '@/components/content/card-thumbnail';
import { Typography } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/text-area';
import { Button } from '@/components/ui/button';
import { snackbar } from '@/components/ui/snackbar';
import { ThumbnailImage } from '@/components/content/thumbnail-image';

// TODO: 실제 API 연동 시 params.id로 데이터 fetch
const MOCK_REVIEW = {
  id: 1,
  rating: 4,
  title: 'Review Title',
  body: '취소표 잡고 방문한 팝업, 혼자가도 부담없고 가볍게 레고를 만들수 있어서 재미있어요.\n\n단 레고 부품이 몇개 없을수 있는건 카운터 가서 물어보면 찾아주십니다.\n\n구매가능한 레고도 많은데 구입할건 조금 적은편!\n\n추천합니다',
  photos: ['', '', '', ''],
  popup: {
    thumbnailUrl: undefined as string | undefined,
    title: 'Title',
    description: 'Sub Text',
    caption: 'Caption',
  },
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
            radius="ML"
            border="SUBTLE"
          />
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer bg-[var(--btn-secondary-default)]"
            aria-label={`이미지 ${i + 1} 삭제`}
          >
            <Icon
              name="Close"
              size={16}
              className="text-[var(--content-high)]"
            />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function ReviewEditPage() {
  const router = useRouter();

  const [rating, setRating] = useState(MOCK_REVIEW.rating);
  const [title, setTitle] = useState(MOCK_REVIEW.title);
  const [body, setBody] = useState(MOCK_REVIEW.body);
  const [images, setImages] = useState<string[]>(MOCK_REVIEW.photos);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemoveImage = (index: number) => {
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
    snackbar.success({ title: '리뷰가 수정되었습니다.' });
    router.back();
  };

  return (
    <section>
      <PageHeader
        title="리뷰 수정"
        titleVariant="heading-1"
        titleWeight="bold"
      />

      <div className="mt-8 flex flex-col gap-8">
        {/* 팝업 썸네일 */}
        <div className="w-[140px]">
          <CardThumbnail
            thumbnailUrl={MOCK_REVIEW.popup.thumbnailUrl}
            thumbnailRatio="3/4"
            title={MOCK_REVIEW.popup.title}
            description={MOCK_REVIEW.popup.description}
            caption={MOCK_REVIEW.popup.caption}
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
