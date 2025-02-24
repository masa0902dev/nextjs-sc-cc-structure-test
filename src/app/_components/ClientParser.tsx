"use client";
import { FC, useState, Suspense } from "react";
import { Article } from "@/_context/types";
import { Presenter } from "./Presenter";
import { SaveButtons } from "./SaveButton";

type Props1 = {
  left: Promise<Article[]>;
  right: Promise<Article[]>;
};

const ClientParser: FC<Props1> = ({ left, right }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  // state Aが更新されると、Aが宣言されているコンポーネント全体が再計算されるので、これも毎回再計算される
  const articlesWithoutRightDuplication = mergeWithoutRightDuplication(articles);

  const moveArticle = (article: Article) => {
    setArticles((prev) => {
      return prev.map((item) =>
        item.link === article.link
          ? { ...item, position: item.position === "left" ? "right" : "left" }
          : item
      );
    });
  };

  const pushArticles = (articles: Article[]) => {
    setArticles((prev) => {
      let newArticles = [...prev, ...articles];
      newArticles = mergeWithoutRightDuplication(newArticles);
      return newArticles;
    });
  };

  let leftToPass: Promise<Article[]> | Article[] = left;
  let rightToPass: Promise<Article[]> | Article[] = right;
  // @ts-expect-error: existing
  if (left.status === "fulfilled") {
    leftToPass = articles.filter((article) => article.position === "left");
  }
  // @ts-expect-error: existing
  if (right.status === "fulfilled") {
    rightToPass = articles.filter((article) => article.position === "right");
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ height: "50vh", overflowY: "scroll" }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Presenter
              position={"left"}
              articlesPromise={leftToPass}
              moveArticle={moveArticle}
              pushArticles={pushArticles}
            />
          </Suspense>
        </div>
        <div style={{ height: "50vh", overflowY: "scroll" }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Presenter
              position={"right"}
              articlesPromise={rightToPass}
              moveArticle={moveArticle}
              pushArticles={pushArticles}
            />
          </Suspense>
        </div>
      </div>
      <SaveButtons articles={articlesWithoutRightDuplication} />
    </div>
  );
};
export default ClientParser;

const mergeWithoutRightDuplication = (articles: Article[]) => {
  const leftLinks = new Set();
  const mergedArticles = articles.reduce((acc: Article[], article: Article) => {
    if (article.position === "left") {
      leftLinks.add(article.link);
      acc.push(article);
    } else if (!leftLinks.has(article.link)) {
      acc.push(article);
    }
    return acc;
  }, []);
  return mergedArticles;
};
