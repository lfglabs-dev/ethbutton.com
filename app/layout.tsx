import React from "next";
import "./styles/globals.css";
import { Providers } from "./provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The ETH button",
  description: "One Blockchain, 5 $ETH, One button.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_LINK as string),
  openGraph: {
    title: "The ETH button",
    description: "One Blockchain, 5 $ETH, One button.",
    url: process.env.NEXT_PUBLIC_APP_LINK,
    siteName: "The ETH button",
    images: [
      {
        url: "/visuals/twitterImage.webp",
        width: 680,
        height: 680,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/icons/theethbutton.svg",
  },
  twitter: {
    card: "summary_large_image",
    title: "The ETH button",
    description: "One Blockchain, 5 $ETH, One button.",
    images: ["/visuals/twitterImage.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="mainContainer">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
