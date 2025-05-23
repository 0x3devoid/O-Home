import type { Metadata } from "next";
import { Aldrich } from "next/font/google";
import "./globals.css";
import { WalletProvider } from './context/WalletContext'
const aldrich = Aldrich({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: "CAPY",
  description: "$CAPY",
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
        <WalletProvider>
          
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
