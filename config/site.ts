export const siteConfig = {
  name: "Hotelix",
  description: "Find and book the perfect hotel for your next trip.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
  api: {
    graphql: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/graphql",
  },
  socials: {
    twitter: "https://twitter.com/hotelix",
    instagram: "https://instagram.com/hotelix",
  },
};