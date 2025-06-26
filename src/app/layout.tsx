import type { Metadata } from "next";
import { Aldrich } from "next/font/google";
import "./globals.css";
const aldrich = Aldrich({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: "O-HOME",
  description: "O-HOME is here! Home for every human",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={aldrich.className}>
      <body
        className="antalized p-4"
      >

          {children}
      </body>
    </html>
  );
}
