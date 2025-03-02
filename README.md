# SCとCCの設計 masaの案

CC -> client conponent  
SC -> server component

## 要約

- 結局、末端でfetchするのでは不可能だった。（考えてみると、そもそもuseStateは変化と同階層に置かないと管理できないので仕方がなし）
  - Compositionパターンでは（親CC,子SC,孫CCで、）子SCでfetchして孫CCで変化するstateを親CCで取得できなかった。よって不可。
  - Compositionでの悩みをuseContext, Provider使って解決できるかと思ったがダメ。
    - (追記：CompositionとuseContext,Provider組み合わせれば実現できそう（親CCでProvider呼ぶ,useState管理->子SCでフェッチ→孫CCでユーザ操作により変化する）。今のSC-CC-CCがCC-SC-CCになるが、今の親SC(Container)では特にコンポーネントをレンダリングしてないので特に悪くない。もしUI要件/機能要件で現在の三階層より深くなる場合、Providerを使うメリットが上回るだろう。)
- 下から3つ目の階層(Container)でSCとしてfetchしている。

## テスト結果

下記の構造でテストして、ドラッグ&ドロップは無しで、左側アイテムをクリックしたら右側アイテムにちゃんと更新される（逆も然り）のを確認した。

DndContext使っても同様に実装できるはず。

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
   最初に受け取った値の場合は、イベントハンドラinitiallyPushArticles()を使ってuseState管理されている記事の変数を更新。すると、そのuseStateを使っているコンポーネント(ClientParser)全体が再計算される。その際に記事の変数leftToPass,rightToPassが更新され、Articleのプロパティpositionのleft,rightによってleftToPass,rightToPassは表示すべき記事のみを受け取る。  
   そして、記事がそれぞれのPresenterの中で表示される。

~~\*ClientParser, Presenterでやっていることの性質上、場合によっては一瞬だけ重複している記事が画面右に見えることがある。何かうまい方法を思いついたら教えて欲しい~~

「一瞬だけ重複している記事が画面右に見えることがある」を修正。  
最初に受け取った値の場合はreturn nullにすることで、重複を含むコンポーネントをレンダリングしない。useEffectはレンダリング後に呼ばれる。useEffect内でinitiallyPushArticles()を実行して結果的に重複が取り除かれた値を取得し、表示する。  
useStateのinitializedはuseEffectの2回目以降の実行を防ぐ・初回時のreturn nullをトリガーするためにフラグとして使っている。

### CCからのPOSTやPATCH

saveButton(CC)でPOSTのfetch実行。Articleのプロパティposition, inDBからPOSTのbodyに含めるかを判断している。  
→→→ nextjsのServer Actionsを使えばSCのように効率化できるかも: [ユーザー操作とデータフェッチ](https://zenn.dev/akfm/books/nextjs-basic-principle/viewer/part_1_interactive_fetch)

- [ ] Server Actionsを試す
