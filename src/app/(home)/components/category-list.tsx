import Link from 'next/link';

const MAIN_CATEGORIES = [
  { id: 1, name: '전체', icon: 'https://placehold.co/80x80' },
  { id: 2, name: '팝업스토어', icon: 'https://placehold.co/80x80' },
  { id: 3, name: '체험존', icon: 'https://placehold.co/80x80' },
  { id: 4, name: '전시', icon: 'https://placehold.co/80x80' },
  { id: 5, name: '푸드', icon: 'https://placehold.co/80x80' },
  { id: 6, name: '키즈', icon: 'https://placehold.co/80x80' },
];

export const CategoryList = () => {
  return (
    <div className="flex justify-center items-center flex-wrap gap-10 my-2xl">
      {MAIN_CATEGORIES.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.id}`}
          className="flex flex-col items-center basis-auto"
        >
          <img
            src={category.icon}
            alt={category.name}
            className="w-20 h-20 rounded-xl mb-2"
          />
          <span className="text-Contents-High text-base font-normal leading-6">
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  );
};
