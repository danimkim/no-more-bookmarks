import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/src/contexts/AuthContext";

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
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
