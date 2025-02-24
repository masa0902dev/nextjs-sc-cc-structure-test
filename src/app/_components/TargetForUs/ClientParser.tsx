"use client";
import { FC, useState, Suspense } from "react";
import type { Article } from "@/app/types.d";
import { Presenter } from "@/app/_components/TargetForUs/Presenter";
import { SaveButtons } from "@/app/_components/TargetForUs/SaveButton";

type Props1 = {
  left: Promise<Article[]>;
  right: Promise<Article[]>;
};

type PendingOrFulfilled = Promise<Article[]> | Article[];

const ClientParser: FC<Props1> = ({ left, right }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  // state Aが更新されると、Aが宣言されているコンポーネント全体が再計算されるので、これも毎回再計算される
  // (Setは重複のない集合の意味)
  const articlesSet = mergeWithoutRightDuplication(articles);

  const leftToPass: PendingOrFulfilled = getArticlesToPass(left, "left", articlesSet);
  const rightToPass: PendingOrFulfilled = getArticlesToPass(right, "right", articlesSet);

  const initiallyPushArticles = (articles: Article[]) => {
    setArticles((prev) => {
      let newArticles = [...prev, ...articles];
      newArticles = mergeWithoutRightDuplication(newArticles);
      return newArticles;
    });
  };

  const moveArticle = (article: Article) => {
    setArticles((prev) => {
      return prev.map((item) =>
        item.link === article.link
          ? { ...item, position: item.position === "left" ? "right" : "left" }
          : item
      );
    });
  };

  const updateSavedArticles = (articles: Article[]) => {
    setArticles((prev) => {
      return prev.map(
        (item) => articles.find((article) => article.link === item.link) ?? item
      );
    });
  };

  return (
    <div style={{ border: "2px solid green", padding: "1rem" }}>
      <h3>ClientParser: CC</h3>
      <div style={{ display: "flex", gap: "2rem" }}>
        {/* ←ここにDndContextを入れ込むことになると思う。その子コンポーネントが下の奴ら↓ */}
        {["left", "right"].map((position) => {
          const boxStyle = {
            width: "150px",
            height: "50vh",
            padding: "1rem",
            border: "2px solid blue",
          };
          const fallback = (
            <div>
              <h4>{position}</h4>
              <p>Loading...</p>
            </div>
          );
          return (
            <div key={position} style={{ ...boxStyle, overflowY: "scroll" }}>
              <Suspense fallback={fallback}>
                <Presenter
                  position={position}
                  articlesPromise={position === "left" ? leftToPass : rightToPass}
                  moveArticle={moveArticle}
                  initiallyPushArticles={initiallyPushArticles}
                />
              </Suspense>
            </div>
          );
        })}
      </div>
      <SaveButtons articles={articlesSet} updateArticles={updateSavedArticles} />
    </div>
  );
};
export default ClientParser;

const mergeWithoutRightDuplication = (articles: Article[]) => {
  const leftLinks = new Set();
  // filter: trueなら追加、falseなら追加しない
  return articles.filter((article) => {
    if (article.position === "left") {
      leftLinks.add(article.link);
      return true;
    }
    return !leftLinks.has(article.link);
  });
};

const getArticlesToPass = (
  leftOrRightArticles: Promise<Article[]> | Article[],
  position: string,
  articles: Article[]
) => {
  if (articles.length === 0) return leftOrRightArticles;

  let articlesToPass = leftOrRightArticles;
  // @ts-expect-error: existing (fulfilledはPromiseが解決された状態。解決されていない状態はpending)
  if (leftOrRightArticles.status === "fulfilled") {
    articlesToPass = articles.filter((article: Article) => article.position === position);
  }
  return articlesToPass;
};
