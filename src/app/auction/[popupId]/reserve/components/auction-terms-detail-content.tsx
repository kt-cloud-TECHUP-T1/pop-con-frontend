import { Typography } from '@/components/ui/typography';

type AuctionTermsArticle = {
  title: string;
  content?: string;
  items?: string[];
  subItems?: string[];
};

type AuctionTermsTableRow = {
  receiver: string;
  purpose: string;
  fields: string[];
  retention: string;
};

export type AuctionTermsSection = {
  title: string;
  description?: string;
  articles?: AuctionTermsArticle[];
  table?: AuctionTermsTableRow[];
  notice?: string;
};

export default function AuctionTermsDetailContent({
  section,
}: {
  section: AuctionTermsSection;
}) {
  return (
    <div className="flex flex-col gap-3 text-xs text-neutral-500 leading-relaxed">
      <Typography
        variant="body-2"
        weight="medium"
        className="text-neutral-600"
      >
        {section.title}
      </Typography>

      {section.description && <p>{section.description}</p>}

      {section.articles?.map((article) => (
        <div key={article.title}>
          <Typography
            variant="body-2"
            weight="medium"
            className="text-neutral-600"
          >
            {article.title}
          </Typography>
          {article.content && <p className="mt-1">{article.content}</p>}
          {article.items && (
            <ol className="list-decimal pl-4 mt-1 flex flex-col gap-1">
              {article.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          )}
          {article.subItems && (
            <ul className="list-disc pl-4 mt-1 flex flex-col gap-0.5">
              {article.subItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {section.table && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse border border-neutral-200">
            <thead>
              <tr className="bg-neutral-100">
                <th className="border border-neutral-200 p-1.5 text-left font-medium text-neutral-600">
                  제공받는 자
                </th>
                <th className="border border-neutral-200 p-1.5 text-left font-medium text-neutral-600">
                  제공 목적
                </th>
                <th className="border border-neutral-200 p-1.5 text-left font-medium text-neutral-600">
                  제공 항목
                </th>
                <th className="border border-neutral-200 p-1.5 text-left font-medium text-neutral-600">
                  보유 및 이용 기간
                </th>
              </tr>
            </thead>
            <tbody>
              {section.table.map((row) => (
                <tr key={row.receiver}>
                  <td className="border border-neutral-200 p-1.5 align-top">
                    {row.receiver}
                  </td>
                  <td className="border border-neutral-200 p-1.5 align-top">
                    {row.purpose}
                  </td>
                  <td className="border border-neutral-200 p-1.5 align-top">
                    {row.fields.join(', ')}
                  </td>
                  <td className="border border-neutral-200 p-1.5 align-top">
                    {row.retention}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section.notice && <p className="text-neutral-400">{section.notice}</p>}
    </div>
  );
}
