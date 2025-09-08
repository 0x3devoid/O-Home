import type { Metadata } from "next";
import { Aldrich } from "next/font/google";
import "./globals.css";
const aldrich = Aldrich({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: "EdQorta",
  description: "EdQorta is your trusted platform for leasing, renting, and buying apartments—making the process easier, faster, and more reliable.",
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
