export type Article = {
  link: string;
  title: string;
  categories: string[];
  position: "left" | "right";
  inDB: boolean;
};
