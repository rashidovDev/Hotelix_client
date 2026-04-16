import type { Metadata } from "next";
import { Geist } from "next/font/google";
import ApolloClientProvider from "@/lib/apollo/provider";
import RouteChrome from "@/components/layout/RouteChrome";
import { siteConfig } from "@/config/site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} flex flex-col min-h-screen`}>
        <ApolloClientProvider>
          <RouteChrome>{children}</RouteChrome>
        </ApolloClientProvider>
      </body>
    </html>
  );
}