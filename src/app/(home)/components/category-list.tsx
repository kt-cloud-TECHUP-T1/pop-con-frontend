'use client';

import Link from 'next/link';
import { useSectionFetch } from '../hooks/use-section-fetch';
import { CategoryListSkeleton } from './skeletons';
import { useRouter } from 'next/navigation';
import { PopupPhase } from '../types';

interface CategoryItem {
  iconUrl: string | null;
  iconName: string;
  popupId: number;
  phase: PopupPhase;
}

const CATEGORY_LIMIT = 6;

export const CategoryList = () => {
  const categories = useSectionFetch<CategoryItem>(
    `/api/popups/categories?limit=${CATEGORY_LIMIT}`
  );

  const router = useRouter();

  if (categories === null) return <CategoryListSkeleton />;
  if (categories.length === 0) return null;

  const handleBannersClick = (
    popupId: number,
    phaseType: 'AUCTION' | 'DRAW'
  ) => {
    if (phaseType === 'AUCTION') {
      router.push(`/auction/${popupId}`);
    } else {
      router.push(`/draw/${popupId}`);
    }
  };

  return (
    <div className="flex justify-center items-center flex-wrap gap-10 my-3xl">
      {categories.map((category) => (
        <div
          key={category.iconName}
          onClick={() =>
            handleBannersClick(category.popupId, category.phase.type)
          }
          className="flex flex-col items-center basis-auto cursor-pointer"
        >
          <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100 overflow-hidden">
            <img
              src={category.iconUrl ?? '/images/temp/no-image.png'}
              alt={category.iconName}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="text-Contents-High text-base font-normal leading-6">
            {category.iconName}
          </span>
        </div>
      ))}
    </div>
  );
};
