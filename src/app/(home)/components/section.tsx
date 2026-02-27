import { Icon } from '@/components/Icon/Icon';

export interface SectionHeaderProps {
  title: string;
  showButtonMore?: boolean;
  onClickMore?: () => void;
}

const SectionTitle = ({
  title,
  showButtonMore,
  onClickMore,
}: SectionHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="justify-start text-black text-3xl font-bold leading-10">
        {title}
      </h2>
      {showButtonMore && (
        <button
          type="button"
          className="inline-flex justify-start items-center gap-0.5 text-neutral-500 cursor-pointer"
          onClick={onClickMore}
        >
          <span className="justify-start text-Contents-Extra-Low text-base font-medium leading-6">
            더보기
          </span>
          <span className="w-5 h-5 flex justify-center items-center">
            <Icon name="ArrowSimpleRight" size={10} />
          </span>
        </button>
      )}
    </div>
  );
};

export const Section = ({
  children,
  title,
  showButtonMore,
  onClickMore,
}: { children: React.ReactNode } & SectionHeaderProps) => {
  return (
    <section className="mb-20">
      <SectionTitle
        title={title}
        showButtonMore={showButtonMore}
        onClickMore={onClickMore}
      />
      {children}
    </section>
  );
};
