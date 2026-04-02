import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page Template Portal",
  description: "Content guidance, recommended modules, and discovery questions for typical website pages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
