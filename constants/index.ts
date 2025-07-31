export const POST_CATEGORIES = [
  "Art & Culture",
  "Lifestyle",
  "Food & Cooking",
  "Technology",
  "Travel",
  "Music",
  "Fashion",
  "Education",
  "Entertainment",
  "Sports",
  "Other",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];
