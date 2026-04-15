import { Typography } from '@/components/ui/typography';

type TableRow = {
  purpose: string;
  items: string;
  retention: string;
};

type ArticleItem = string | { text: string; subItems?: string[] };

type Article = {
  number: number;
  title: string;
  content?: string;
  description?: string;
  items?: ArticleItem[];
};

export type TermsContent =
  | { id: string; required: boolean; content: string }
  | {
      id: string;
      required: boolean;
      description: string;
      table: TableRow[];
      channels?: string[];
      refusalNotice?: string;
    }
  | { id: string; required: boolean; articles: Article[] };

export default function TermsDetailContent({
  content,
}: {
  content: TermsContent;
}) {
  if ('content' in content) {
    return (
      <Typography variant="body-2" className="text-[#737373] leading-relaxed">
        {content.content}
      </Typography>
    );
  }

  if ('articles' in content) {
    return (
      <div className="flex flex-col gap-3 text-xs text-[#737373] leading-relaxed">
        {content.articles.map((article) => (
          <div key={article.number}>
            <Typography
              variant="body-2"
              weight="medium"
              className="text-[#525252]"
            >
              제 {article.number} 조 ({article.title})
            </Typography>
            {article.content && <p className="mt-1">{article.content}</p>}
            {article.description && (
              <p className="mt-1">{article.description}</p>
            )}
            {article.items && (
              <ol className="list-decimal pl-4 mt-1 flex flex-col gap-1">
                {article.items.map((item, i) => {
                  if (typeof item === 'string') {
                    return <li key={i}>{item}</li>;
                  }
                  return (
                    <li key={i}>
                      {item.text}
                      {item.subItems && (
                        <ul className="list-disc pl-4 mt-1 flex flex-col gap-0.5">
                          {item.subItems.map((sub, j) => (
                            <li key={j}>{sub}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 text-xs text-[#737373] leading-relaxed">
      <p>{content.description}</p>
      <table className="w-full border-collapse border border-[#e5e5e5]">
        <thead>
          <tr className="bg-[#f5f5f5]">
            <th className="border border-[#e5e5e5] p-1.5 text-left font-medium text-[#525252]">
              수집 및 이용 목적
            </th>
            <th className="border border-[#e5e5e5] p-1.5 text-left font-medium text-[#525252]">
              수집 항목
            </th>
            <th className="border border-[#e5e5e5] p-1.5 text-left font-medium text-[#525252]">
              보유 및 이용 기간
            </th>
          </tr>
        </thead>
        <tbody>
          {content.table.map((row, i) => (
            <tr key={i}>
              <td className="border border-[#e5e5e5] p-1.5 align-top">
                {row.purpose}
              </td>
              <td className="border border-[#e5e5e5] p-1.5 align-top">
                {row.items}
              </td>
              <td className="border border-[#e5e5e5] p-1.5 align-top">
                {row.retention}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {content.channels && (
        <div>
          <p className="font-medium text-[#525252] mb-1">
            마케팅 정보 수신 채널
          </p>
          <ul className="list-disc pl-4 flex flex-col gap-0.5">
            {content.channels.map((ch) => (
              <li key={ch}>{ch}</li>
            ))}
          </ul>
        </div>
      )}
      {content.refusalNotice && (
        <p className="text-[#a3a3a3]">{content.refusalNotice}</p>
      )}
    </div>
  );
}
