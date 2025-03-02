"use clinet"
import { FC, use } from "react"

type Props = {
  postsPromise: Promise<any>
}

const Shower: FC<Props> = ({ postsPromise }) => {
  const posts = use(postsPromise)

  return (
    <div>
      <h3>Shower: CC</h3>
      <div>
        {posts.map((post: any) => (
          <div key={post.link}>
            <label>{post.link}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Shower
