import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Created by Mirza",
  description: "A social media the the world needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
