export type Book = {
  title: string;
  author: string;
  cover: { bg: string; fg?: string };
};

export const reading: {
  current: Book[];
  finished: Book[];
} = {
  current: [
    {
      title: "The Art of Doing Science and Engineering",
      author: "Richard Hamming",
      cover: { bg: "#2e3a4e", fg: "#f5efdc" },
    },
    {
      title:
        "The Daily Stoic: 366 Meditations on Wisdom, Perseverance, and the Art of Living",
      author: "Ryan Holiday, Stephen Hanselman",
      cover: { bg: "#2a2a2a", fg: "#f5efdc" },
    },
  ],
  finished: [
    {
      title: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki, Sharon Lechter",
      cover: { bg: "#8b2d1e", fg: "#f5efdc" },
    },
  ],
};
