import type { Metadata } from "next";

import { SiteNav } from "@/components/SiteNav";
import "./app.css";

export const metadata: Metadata = {
  title: "Cryo - Fruit Soda From The Deep Freeze",
  description:
    "A creative animated landing page for Cryo, a cold-wave fruit soda can brand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(()=>{try{if("scrollRestoration"in history){history.scrollRestoration="manual"}window.scrollTo(0,0)}catch(error){}})();',
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
