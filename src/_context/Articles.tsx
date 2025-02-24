"use client";
import { ArticlesProvider } from "./ArticlesProvider";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { Article } from "./types";
import {
  ArticlesContainer,
  fetchArticlesPosts,
  fetchArticlesTodos,
} from "./ArticlesContainer";

const Articles = () => {
  const [articlesLeft, setArticlesLeft] = useState<Article[]>([]);
  const [articlesRight, setArticlesRight] = useState<Article[]>([]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const articleId = active.id as Article["id"];
    const newPosition = over.id as Article["position"];

    setArticlesLeft((prev) => {
      const updatedArticles = prev.map((article) =>
        article.id === articleId
          ? {
              ...article,
              position: newPosition,
            }
          : article
      );
      return updatedArticles;
    });
  };

  return (
    <div style={{ border: "2px solid black", padding: "10px" }}>
      <h2>Articles in CC</h2>
      <ArticlesProvider>
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          <div style={{ display: "flex", gap: "10px" }}>
            <ArticlesContainer fetcher={fetchArticlesPosts} />
            <ArticlesContainer fetcher={fetchArticlesTodos} />
          </div>
        </DndContext>
        {/* <div style={{ display: "flex", gap: "10px" }}>
          <ArticlesContainer fetcher={fetchArticlesPosts} />
          <ArticlesContainer fetcher={fetchArticlesTodos} />
        </div> */}
      </ArticlesProvider>
    </div>
  );
};

export default Articles;
