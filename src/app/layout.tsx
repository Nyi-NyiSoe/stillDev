import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StillDev",
  description: "A daily 10-question developer sharpness check.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>{children}</body>
    </html>
  );
}
