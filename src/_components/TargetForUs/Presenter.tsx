import { Article } from "@/app/types.d"
import { FC, use, useEffect, useState } from "react"

type Props2 = {
  position: string
  articlesPromise: Promise<Article[]> | Article[]
  moveArticle: (article: Article) => void
  initiallyPushArticles: (articles: Article[]) => void
}

export const Presenter: FC<Props2> = ({
  position,
  articlesPromise,
  moveArticle,
  initiallyPushArticles,
}) => {
  // Suspense のためにPromiseをuse()で解決
  const articles =
    articlesPromise instanceof Promise ? use(articlesPromise) : articlesPromise

  // initializedは初回のinitiallyPushArticles実行を記録し、useEffectの2回目以降の実行を防ぐ
  const [initialized, setInitialized] = useState(false)
  useEffect(() => {
    if (!initialized) {
      initiallyPushArticles(articles)
      setInitialized(true)
    }
  }, [articles, initiallyPushArticles, initialized])

  if (!initialized) return null

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
  )
}
