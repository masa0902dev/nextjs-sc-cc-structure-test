import React, { FC, useEffect, use } from "react";
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
  const articles =
    articlesPromise instanceof Promise ? use(articlesPromise) : articlesPromise;

  useEffect(() => {
    pushArticles(articles);
    // 依存配列を空にして、初回レンダリング時にのみ発火。依存配列入れると無限ループ
    // 右側アイテムの重複ありでも無しでも問題なかった。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
