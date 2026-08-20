import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TITAN FORGE GYM | Build Your Strongest Self",
  description:
    "Raw iron, elite training, and complete gym membership management. Join today and sculpt peak human strength.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
