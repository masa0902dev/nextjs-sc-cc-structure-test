import React from "react";
import Header from "./_components/Header";
import Container from "@/app/_components/TargetForUs/Container";

const Page = () => {
  return (
    <div style={{ border: "2px solid black", padding: "1rem" }}>
      <h1>Page in SC</h1>
      <Header />
      <Container />
    </div>
  );
};

export default Page;
