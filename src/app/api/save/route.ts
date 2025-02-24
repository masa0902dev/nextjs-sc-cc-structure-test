import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const body = await req.json(); // `req.body` ではなく `req.json()` を使用

    for (const obj of body) {
      console.log(obj);

      if (!obj.link || !obj.title || !obj.categories) {
        return NextResponse.json({ error: "Invalid body" }, { status: 400 });
      }
      console.log("saved:", obj.link, obj.title, obj.categories);
    }

    return NextResponse.json({
      message: "Success",
      body: body,
    });
  } catch (err) {
    return NextResponse.json({ error: "POST error" + err }, { status: 400 });
  }
}
