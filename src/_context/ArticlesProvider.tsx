import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
import { Article } from "./types";

// 引数（初期値が必要）

// State用のContextを作成します
const ArticlesStateContext = createContext<Article[] | undefined>(undefined);
// 更新関数用のContextを作成します
const ArticlesDispatchContext = createContext<
  Dispatch<SetStateAction<Article[] | undefined>> | undefined
>(undefined);

// ArticlesProviderコンポーネントを定義します
const ArticlesProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<Article[] | undefined>(undefined);

  return (
    <ArticlesStateContext.Provider value={articles}>
      <ArticlesDispatchContext.Provider value={setArticles}>
        {children}
      </ArticlesDispatchContext.Provider>
    </ArticlesStateContext.Provider>
  );
};

// 各Contextを利用するカスタムフックを定義してエクスポートします
const useArticlesState = () => useContext(ArticlesStateContext);
const useArticlesDispatch = () => useContext(ArticlesDispatchContext);

export { ArticlesProvider, useArticlesDispatch, useArticlesState };
