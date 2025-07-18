import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "No More Bookmarks",
  description:
    "A personal archive for turning saved inspiration into real action and trackable progress.",
  generator: "next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
