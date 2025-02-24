import { Article } from "./types";
import { use, FC, useState } from "react";

type Props = {
  articlesPromise: Promise<Article[]>;
};

const ArticlePresenter: FC<Props> = ({ articlesPromise }) => {
  const articlesResolved = use(articlesPromise);
  const [articles, setArticles] = useState(articlesResolved);

  return (
    <div>
      <h4>Presenter in CC</h4>
      {articles.map((article: Article) => (
        <div key={article.id}>
          <h3>{article.title}</h3>
          {article.body && <p>article.body</p>}
        </div>
      ))}
    </div>
  );
};

export default ArticlePresenter;
