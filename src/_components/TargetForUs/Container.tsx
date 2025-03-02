import ClientParser from "@/_components/TargetForUs/ClientParser"

const Container = () => {
  // use()を使うのでawaitしない！！！
  const left = fetcher("type=left")
  const right = fetcher("type=right")

  return (
    <div style={{ border: "2px solid red", padding: "1rem" }}>
      <h2>Cotainer: SC</h2>
      <ClientParser left={left} right={right} />
    </div>
  )
}
export default Container

const fetcher = async (query: string) => {
  const url = `http://localhost:3000/api?${query}`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 7200 },
  })
  // 1秒まつ(実際そのくらいかかるだろう)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const articles = await res.json()
  return articles
}
