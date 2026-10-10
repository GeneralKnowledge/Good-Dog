import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import { APP_DESCRIPTION, APP_NAME, THEME_COLOR } from "@/lib/app-meta";
import "./globals.css";

// Variable fonts — do not pass a weight array. Turbopack's Google-font loader
// only accepts a single query entry; discrete weights break CSS loading.
const display = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const body = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  // Older iOS versions only honour the prefixed tag; Next emits just the modern one.
  other: { "apple-mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full antialiased">
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
