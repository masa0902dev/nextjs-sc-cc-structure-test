import React, { FC } from "react";
import { Article } from "@/app/types.d";

type Props3 = {
  articles: Article[];
  updateArticles: (articles: Article[]) => void;
};

export const SaveButtons: FC<Props3> = ({ articles, updateArticles }) => {
  // CCでもイベントハンドラ(onClickなど)の中ならasync/await使えた！！！
  // useEffectの中でも使える(useEffect自体はasyncできない)
  const handleSave = async () => {
    const articlesToSave = articles.filter(
      (article) => !article.inDB && article.position === "left"
    );
    const updatedArticles = await saveAndUpdateArticles(articlesToSave);
    if (updatedArticles) updateArticles(updatedArticles);
    console.log(updatedArticles);
  };

  return (
    <div>
      <h4>SaveButton: CC</h4>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

const saveAndUpdateArticles = async (articles: Article[]) => {
  if (articles.length === 0) {
    alert("the articles are already save"); // 本来はalert()ではなくポップアップを表示
    return null;
  }

  const body = articles.map((article) => {
    return {
      link: article.link,
      title: article.title,
      categories: article.categories,
    };
  });

  try {
    await fetch("http://localhost:3000/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    alert("Saved Successfully"); // 本来はalert()ではなくポップアップを表示
    for (const article of articles) {
      article.inDB = true;
    }
    return articles;
  } catch (err) {
    console.error(err);
    alert("Failed to save"); // 本来はalert()ではなくポップアップを表示
    return null;
  }
};
