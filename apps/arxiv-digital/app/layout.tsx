import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@template/components/theme-provider";
import { cn } from "@template/lib/utils";

const notoSans = Noto_Sans({ variable: "--font-sans" });

const fontMono = Noto_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        notoSans.variable,
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
