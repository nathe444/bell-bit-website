import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/animations/SmoothScrollProvider";
import { Navbar } from "@/components/navigation/Navbar";
import { CustomCursor } from "@/components/navigation/CustomCursor";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bell-bit.com"),
  title: "BellBit Software Technologies | We turn complexity into systems",
  description:
    "BellBit Software Technologies builds software products and custom digital solutions that solve real business problems — custom software, mobile apps, UI/UX, system architecture, and deployment.",
  keywords: [
    "BellBit",
    "software development Ethiopia",
    "custom software",
    "system architecture",
    "mobile app development",
    "UI/UX design",
    "BinWise",
    "Tena-Bit",
  ],
  openGraph: {
    title: "BellBit Software Technologies | We turn complexity into systems",
    description:
      "Software products and custom digital solutions that solve real business problems.",
    url: "https://bell-bit.com",
    siteName: "BellBit Software Technologies",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full bg-void text-paper antialiased">
        <SmoothScrollProvider>
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
