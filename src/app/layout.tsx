import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Money Magic - Learn Pounds & Pence!",
  description: "A fun interactive game to learn about British money",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
