type FetchErrorProps = {
  sectionTitle?: string;
  message?: string;
};

export const FetchError = ({
  sectionTitle = '섹션 오류',
  message = '현재 데이터를 불러올 수 없어요.',
}: FetchErrorProps) => (
  <section
    className="min-h-[250px] flex items-center justify-center"
    aria-label={sectionTitle}
    role="alert"
  >
    {message}
  </section>
);
