import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--f-d" });
const body = Manrope({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--f-b" });

export const metadata: Metadata = {
  title: "Your Studio | Brand, Motion and Web Design",
  description: "A creative studio for brand identity, graphic design, motion and web design.",
  openGraph: { title: "Your Studio | Brand, Motion and Web Design", description: "We turn bold ideas into unforgettable visuals.", type: "website" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function Root({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className={`${display.variable} ${body.variable}`}>{children}</body></html>);
}
