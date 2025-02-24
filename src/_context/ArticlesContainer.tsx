import ArticlePresenter from "./ArticlesPresenter";
import { Article } from "./types";
import { Suspense, FC } from "react";

type Props = {
  fetcher: () => Promise<Article[]>;
};

export const ArticlesContainer: FC<Props> = ({ fetcher }) => {
  const articles = fetcher();
  return (
    <div style={{ border: "2px solid skyblue", padding: "10px", width: "50%" }}>
      <h3>Container in SC</h3>
      <Suspense fallback={<div>Loading...</div>}>
        <ArticlePresenter articlesPromise={articles} />
      </Suspense>
    </div>
  );
};

export const fetchArticlesPosts = async () => {
  const url = "https://jsonplaceholder.typicode.com/posts";
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 7200 },
  });
  // 2秒まつ
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const articles = await res.json();
  const userArticles = articles.filter((article: Article) => article.userId === 1);
  return userArticles;
};

export const fetchArticlesTodos = async () => {
  const url = "https://jsonplaceholder.typicode.com/todos";
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 7200 },
  });
  // 1秒まつ
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const articles = await res.json();
  const userArticles = articles.filter((article: Article) => article.userId === 1);
  return userArticles;
};
