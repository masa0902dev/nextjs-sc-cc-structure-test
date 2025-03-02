import { Suspense } from "react"
import Shower from "./Shower"

const Page = () => {
  return (
    <div>
      <h1>Page in SC</h1>
      <Header />
      <Container />
    </div>
  )
}
export default Page

const Header = () => {
  return (
    <div>
      <h2>Header in SC</h2>
    </div>
  )
}

const Container = () => {
  const postsL = fetcher("left")
  const postsR = fetcher("right")
  console.log("res in Container:", postsL)

  return (
    <div>
      <h3>Container in SC</h3>
      <Suspense fallback={<div>Loading left...</div>}>
        <Shower postsPromise={postsL} />
      </Suspense>
      <Suspense fallback={<div>Loading righy...</div>}>
        <Shower postsPromise={postsR} />
      </Suspense>
    </div>
  )
}
const fetcher = async (type: string) => {
  const res = await fetch("http://localhost:3000/api?type=" + type)
  console.log("res in fetcher:", res)
  return res.json()
}
