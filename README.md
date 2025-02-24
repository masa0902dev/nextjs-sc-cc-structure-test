# SCとCCの設計 masaの案
## 要約
- 結局、末端でfetchするのでは不可能だった。（考えてみると、そもそもuseStateは変化と同階層に置かないと管理できないので仕方がなし）
  - Compositionパターンでは（親CC,子SC,孫CCで、）子SCが生成して孫CCで変化するstateを親CCで取得できなかった。よって不可。
  - Compositionでの悩みをuseContext, Provider使って解決できるかと思ったがダメ。
- 下から3つ目の階層(Container)でSCとしてfetchしている。


## テスト結果
下記の構造でテストして、ドラッグ&ドロップは無しで、左側アイテムをクリックしたら右側アイテムにちゃんと更新される（逆も然り）のを確認した。

## 登場人物(コンポーネント)
- Page：ページコンポーネントそのもの。SC
- Container：fetchを担当。SC
- ClientParser：CCをラップして、SCを作り出すためのもの。今回はここをParser(値を変換したりする)にしている。SC
- DndContext：ドラッグ&ドロップのために必要。CC
- Presenter：値の表示を担当する(今回は処理も含む)。CC。今回はここでuse()を使う([reactのuse-hook](https://react.dev/reference/react/use#streaming-data-from-server-to-client))

## しくみの要約
ClientParser, Presenterレイヤーでかなり特殊なことをやっている。

```ts
<Page>
  <Container>         // fetchする
    <ClientParesr>    // CCでuseStateなど
      <DndContext>
        <Presenter /> // 画面左の記事データを受け取る（ただし初回は特殊な処理をしてる） 
        <Presenter /> // 画面右の記事データを受け取る（ただし初回は特殊な処理をしてる） 
      </DndContext>
    </ClientParesr>
  </Container>
</Page>
```

1. Containerで左右の記事それぞれをフェッチ（use()を使うためにawaitしない！）して、ClientParserにそれぞれ渡す

2. ClientParserで記事全体をuseState管理する。  
画面右の記事による重複を取り除いた変数articlesSetを元にした値を画面左・右に表示するPresenterに渡す。  
また、Suspenseを使ってローディングUIを表示する。

3. Presenterで値を表示。  
ただし、最初に受け取った値(fetchされて渡ってきた値, Promise)にはuse()を使って、各コンポーネントでのローディングUIを実現する。  
最初に受け取った値の場合は、イベントハンドラInitiallyPushArticles()を使ってuseState管理されている記事の変数を更新。すると、そのuseStateを使っているコンポーネント(ClientParser)全体が再計算される。その際に記事の変数leftToPass,rightToPassが更新され、Articleのプロパティpositionのleft,rightによってleftToPass,rightToPassは表示すべき記事のみを受け取る。  
そして、記事がそれぞれのPresenterの中で表示される。

*ClientParser, Presenterでやっていることの性質上、場合によっては一瞬だけ重複している記事が画面右に見えることがある。（）
