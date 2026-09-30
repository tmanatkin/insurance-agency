import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Insurance Risk Assessment",
  description: "Home and auto insurance risk assessment with AI-generated recommendations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={openSans.variable}>
      <head></head>
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
