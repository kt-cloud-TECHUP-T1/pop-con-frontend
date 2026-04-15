import { Typography } from '@/components/ui/typography';

type TableRow = {
  purpose: string;
  items: string;
  retention: string;
};

type ArticleItem = string | { text: string; subItems?: string[] };

type Article = {
  title: string;
  content?: string;
  description?: string;
  items?: ArticleItem[];
};

type SimpleTerms = {
  kind: 'simple';
  content: string;
};

type TableTerms = {
  kind: 'table';
  description: string;
  table: TableRow[];
  channels?: string[];
  refusalNotice?: string;
};

type ArticlesTerms = {
  kind: 'articles';
  articles: Article[];
};

export type TermsContent = SimpleTerms | TableTerms | ArticlesTerms;

export default function TermsDetailContent({
  content,
}: {
  content: TermsContent;
}) {
  switch (content.kind) {
    case 'simple':
      return <SimpleDetail content={content} />;
    case 'table':
      return <TableDetail content={content} />;
    case 'articles':
      return <ArticlesDetail content={content} />;
  }
}

function SimpleDetail({ content }: { content: SimpleTerms }) {
  return (
    <Typography variant="body-2" className="text-neutral-500 leading-relaxed">
      {content.content}
    </Typography>
  );
}

function ArticlesDetail({ content }: { content: ArticlesTerms }) {
  return (
    <div className="flex flex-col gap-3 text-xs text-neutral-500 leading-relaxed">
      {content.articles.map((article, index) => (
        <div key={index}>
          <Typography
            variant="body-2"
            weight="medium"
            className="text-neutral-600"
          >
            제 {index + 1} 조 ({article.title})
          </Typography>
          {article.content && <p className="mt-1">{article.content}</p>}
          {article.description && <p className="mt-1">{article.description}</p>}
          {article.items && (
            <ol className="list-decimal pl-4 mt-1 flex flex-col gap-1">
              {article.items.map((item, i) => (
                <li key={i}>
                  {typeof item === 'string' ? (
                    item
                  ) : (
                    <>
                      {item.text}
                      {item.subItems && (
                        <ul className="list-disc pl-4 mt-1 flex flex-col gap-0.5">
                          {item.subItems.map((sub, j) => (
                            <li key={j}>{sub}</li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      ))}
    </div>
  );
}

function TableDetail({ content }: { content: TableTerms }) {
  return (
    <div className="flex flex-col gap-3 text-xs text-neutral-500 leading-relaxed">
      <p>{content.description}</p>
      <table className="w-full border-collapse border border-neutral-200">
        <thead>
          <tr className="bg-neutral-100">
            <th className="border border-neutral-200 p-1.5 text-left font-medium text-neutral-600">
              수집 및 이용 목적
            </th>
            <th className="border border-neutral-200 p-1.5 text-left font-medium text-neutral-600">
              수집 항목
            </th>
            <th className="border border-neutral-200 p-1.5 text-left font-medium text-neutral-600">
              보유 및 이용 기간
            </th>
          </tr>
        </thead>
        <tbody>
          {content.table.map((row, i) => (
            <tr key={i}>
              <td className="border border-neutral-200 p-1.5 align-top">
                {row.purpose}
              </td>
              <td className="border border-neutral-200 p-1.5 align-top">
                {row.items}
              </td>
              <td className="border border-neutral-200 p-1.5 align-top">
                {row.retention}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {content.channels && (
        <div>
          <p className="font-medium text-neutral-600 mb-1">
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
        <p className="text-neutral-400">{content.refusalNotice}</p>
      )}
    </div>
  );
}
