// export type Article = {
//   userId: number;
//   id: number;
//   title: string;
//   body?: string; // categoriesを模倣（jsonplaceholderの/postsにはbodyある、/todosにはない）
//   position: "left" | "right";
// };

export type Article = {
  link: string;
  title: string;
  categories?: string[];
  position: "left" | "right";
  inDB: boolean;
};
