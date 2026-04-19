'use client';

import Link from 'next/link';
import { useSectionFetch } from '../hooks/use-section-fetch';
import { CategoryListSkeleton } from '../components/skeletons';
import { PopupPhase } from '../types';
import { Box } from '@/components/ui/box';
import { FetchError } from '@/components/common/fetch-error';
import { getPopupHref } from '@/lib/utils';

interface CategoryItem {
  iconUrl: string | null;
  iconName: string;
  popupId: number;
  phase: PopupPhase;
}

const CATEGORY_LIMIT = 6;

export const CategoryList = () => {
  const { data: categories, isError } = useSectionFetch<CategoryItem>(
    `/api/popups/categories?limit=${CATEGORY_LIMIT}`
  );

  if (isError) return <FetchError sectionTitle="카테고리 목록" />;
  if (categories === null) return <CategoryListSkeleton />;
  if (categories.length === 0) return null;

  return (
    <div className="flex justify-center items-center flex-wrap gap-10 my-3xl">
      {categories.map((category, index) => (
        <Link
          key={`category-${category.popupId}-${index}`}
          href={getPopupHref(category.popupId, category.phase.type)}
          className="flex flex-col items-center basis-auto cursor-pointer"
        >
          <Box
            radius="XL"
            background="var(--neutral-90)"
            className="mb-2 flex h-20 w-20 items-center justify-center overflow-hidden"
          >
            <img
              src={category.iconUrl ?? '/images/temp/no-image.png'}
              alt={category.iconName}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </Box>
          <span className="text-Contents-High text-base font-normal leading-6">
            {category.iconName}
          </span>
        </Link>
      ))}
    </div>
  );
};
