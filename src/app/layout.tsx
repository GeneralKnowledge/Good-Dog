import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Nunito_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Good Dog",
  description:
    "A friendly daily dog-training coach for ordinary UK dog owners. Short, practical, reward-based activities.",
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
