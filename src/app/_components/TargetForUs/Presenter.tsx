import React, { FC, useEffect, useState, use } from "react";
import { Article } from "@/app/types.d";

type Props2 = {
  position: string;
  articlesPromise: Promise<Article[]> | Article[];
  moveArticle: (article: Article) => void;
  pushArticles: (articles: Article[]) => void;
};

export const Presenter: FC<Props2> = ({
  position,
  articlesPromise,
  moveArticle,
  pushArticles,
}) => {
  // `useEffect` が完了するまでは `null` にする
  const [articles, setArticles] = useState<Article[] | null>(null);

  useEffect(() => {
    const resolvedArticles =
      articlesPromise instanceof Promise ? use(articlesPromise) : articlesPromise;

    pushArticles(resolvedArticles);
    setArticles(resolvedArticles);
  }, []); // 初回のみ実行

  // `articles` が `null` の間はレンダリングしない
  if (!articles) {
    return null;
  }

  return (
    <div>
      <h4>{position}: CC</h4>
      {articles.map((article: Article) => (
        <div key={article.link}>
          <label>
            {article.link} <button onClick={() => moveArticle(article)}>Switch</button>
          </label>
        </div>
      ))}
    </div>
  );
};
