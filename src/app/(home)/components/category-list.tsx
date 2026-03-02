import Link from 'next/link';
import { Box } from '@/components/ui/box';

const MAIN_CATEGORIES = [
  { id: 1, name: '전체' },
  { id: 2, name: '팝업스토어' },
  { id: 3, name: '체험존' },
  { id: 4, name: '전시' },
  { id: 5, name: '푸드' },
  { id: 6, name: '키즈' },
];

export const CategoryList = () => {
  return (
    <div className="flex justify-center items-center flex-wrap gap-10 my-3xl">
      {MAIN_CATEGORIES.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.id}`}
          className="flex flex-col items-center basis-auto"
        >
          <Box
            className="mb-2 flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500"
            aria-hidden="true"
          >
            {category.name.slice(0, 2)}
          </Box>
          <span className="text-Contents-High text-base font-normal leading-6">
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  );
};
