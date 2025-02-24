import React from "react";
import Header from "./_components/Header";
import ClientParser from "./_components/ClientParser";

const Page = () => {
  const left = fetcher("type=left");
  const right = fetcher("type=right");

  return (
    <div>
      <Header />
      <h1>Page in SC</h1>
      <ClientParser left={left} right={right} />
    </div>
  );
};

const fetcher = async (query: string) => {
  const url = `http://localhost:3000/api?${query}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 7200 },
  });
  // 2秒まつ
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const articles = await res.json();
  return articles;
};

export default Page;
