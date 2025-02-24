import React, { FC, useEffect, use } from "react";
import { Article } from "@/_context/types";

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
  // const isPushed = useRef(false); // 初回の `pushArticles` 実行を記録

  useEffect(() => {
    pushArticles(articles);
    // 依存配列を空にして、初回レンダリング時にのみ発火
    // 今回は重複無しだが、重複ありでも問題なかった
  }, []);

  return (
    <div style={{ marginBottom: "2rem" }}>
      <div>{position}</div>
      {articles.map((article: Article) => (
        <div key={article.link}>
          <label>
            {article.link}
            <button onClick={() => moveArticle(article)}>Switch</button>
          </label>
        </div>
      ))}
    </div>
  );
};
