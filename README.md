# SCとCCの設計 masaの案
## 要約
- 結局、上の方の親でfetchするしかなかった。（考えてみると、そもそもuseStateは変化と同階層に置かないと管理できないので仕方がなし）
  - Compositionパターンでは（親CC,子SC,孫CCで、）子SCが生成して孫CCで変化するstateを親CCで取得できなかった。よって不可。
  - Compositionでの悩みをuseContext, Provider使って解決できるかと思ったがダメ。


## テスト結果
下記の構造でテストして、ドラッグ&ドロップは無しで、左側アイテムをクリックしたら右側アイテムにちゃんと更新される（逆も然り）のを確認した。

## 登場人物(コンポーネント)
- Container：fetchを担当。SC
- ClientParser：CCをラップして、SCを作り出すためのもの。今回はここをParser(値を変換したりする)にしている。SC
- DndContext：ドラッグ&ドロップのために必要。CC
- Presenter：値の表示を担当する。CC。今回はここでuse()を使う！([reactのuse-hook](https://react.dev/reference/react/use#streaming-data-from-server-to-client))→→→使えなかった。個別のSuspense（ローディングUI）はもう諦めてもいいかも


## 構造
疑似コードで説明。本質以外は省略している。  
（これらの階層にデザイン要件でさらに階層を挟むことも可能）

第一階層：SC
```ts
export const Page = () => {
  return (
    <Box>
      {/* 他のコンポーネントはここの階層に */} 
      <Container />
    </Box>
  )
}
```

第二階層：SC
```ts
export const Container = () => {
  // awaitしない！！！これは第四階層のuse()によってコンポーネントごとのSuspense（ローディングUI）を実現するため
  const articlesLeft = fetchArticlesLeft()
  const articlesRight = fetchArticlesRight()

  return (
    <ClientParser left={articlesLeft} right={articlesRight} />
  )
}

const fetchArticlesLeft = async () => {
  /*
    1. fetch
    2. articlesにプロパティを追加して返す
        position: "left"
        inDB: true,
  */
}
const fetchArticlesRight = async () => {
  /*
    1. fetch
    2. articlesにプロパティを追加して返す
        position: "right",
        inDB: false,
  */
}
```

第三階層：CC
```ts
"use client"

export const ClientParser = ({ left, right }) => {
  // 右側記事に左側記事と重複があれば、右側記事から削除する。そして1つの配列にする
  const tmpArticles = mergeWithoutRightDuplication(left, right)
  // set関数で処理するために1つのstateにまとめる。left,rightの記事はプロパティの`position`で区別
  const [articles, setArticles] = useState(tmpArticles)
  // left, rightでそれぞれPresenterに渡す（useStateを元にした変数は、再レンダリングのたびに再計算される）
  const leftArticles = articles.filter((article) => article.position === "left");
  const rightArticles = articles.filter((article) => article.position === "right");

  // Dndによって対象articleの position を更新する処理
  const handleArticles = (event) => {};

  return (
    <div>
      <DndContext onDragEnd={handleArticles}>
        <Presenter position={"left"} articles={leftArticles} />
        <Presenter position={"right"} articles={rightArticles} />
      </DndContext>
      {/* 左画面にある記事のDBへの保存を担うコンポーネント: inDBがfalseだけを保存 */}
      <SaveButtons rightArticles={rightArticles} />
    </div>
  )
}

// O(N+M)で処理
const mergeWithoutRightDuplication = (left: { link: string }[], right: { link: string }[]) => {
  const leftLinks = new Set(left.map((item) => item.link));
  right = right.filter((item) => !leftLinks.has(item.link));
  return [...left, ...right];
};
```

第4階層：CC
```ts
export const Presenter = ({ position, articles }) => {
  // taskAppのColumnに当たるところ。

  // use()が使えなかった。個別のSuspense（ローディングUI）はもう諦めてもいいかも
  // 使えなかった理由は、
}
```
