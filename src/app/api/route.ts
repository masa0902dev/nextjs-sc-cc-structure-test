import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const articles = []

  const searchParams = req.nextUrl.searchParams
  const type = searchParams.get("type")

  if (type === "left") {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    for (let i = 0; i < 20; i++) {
      articles.push({
        link: `link${i}`,
        title: `title${i}`,
        categories: ["cat1", "cat2"],
        position: "left" as const,
        inDB: true,
      })
    }
  } else if (type === "right") {
    for (let i = 16; i < 25; i++) {
      articles.push({
        link: `link${i}`,
        title: `title${i}`,
        categories: ["cat1", "cat2"],
        position: "right" as const,
        inDB: false,
      })
    }
  }

  return Response.json(articles)
}
