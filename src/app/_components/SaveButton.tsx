import React, { FC } from "react";
import { Article } from "@/_context/types";

type Props3 = {
  articles: Article[];
};

export const SaveButtons: FC<Props3> = ({ articles }) => {
  const handleSave = async () => {
    const articlesToSave = articles.filter(
      (article) => !article.inDB && article.position === "left"
    );
    const json = await saveArticles(articlesToSave);
    console.log(json);
  };

  return (
    <div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

const saveArticles = async (articles: Article[]) => {
  if (articles.length === 0) {
    return { message: "No articles to save" };
  }

  const body = articles.map((article) => {
    return {
      link: article.link,
      title: article.title,
      categories: article.categories,
    };
  });

  try {
    const res = await fetch("http://localhost:3000/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return { error: "Failed to save" };
  }
};
