import { Icon } from '@/components/Icon/Icon';

export const Section = ({
  children,
  title,
  showButtonMore,
}: {
  children: React.ReactNode;
  title: string;
  showButtonMore?: boolean;
}) => {
  return (
    <section className="mb-20">
      <SectionTitle title={title} showButtonMore={showButtonMore} />
      {children}
    </section>
  );
};

const SectionTitle = ({
  title,
  showButtonMore,
}: {
  title: string;
  showButtonMore?: boolean;
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="justify-start text-black text-3xl font-bold leading-10">
        {title}
      </div>
      {showButtonMore && (
        <div className="inline-flex justify-start items-center gap-0.5 text-neutral-500">
          <div className="justify-start text-Contents-Extra-Low text-base font-medium leading-6">
            더보기
          </div>
          <span className="w-5 h-5 flex justify-center items-center">
            <Icon name="ArrowSimpleRight" size={10} />
          </span>
        </div>
      )}
    </div>
  );
};
