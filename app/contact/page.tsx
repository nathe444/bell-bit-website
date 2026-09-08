import type { Metadata } from "next";
import { ContactSection } from "@/components/ui/contact";
import { Footer } from "@/sections/Footer/Footer";

export const metadata: Metadata = {
  title: `Contact Us | BellBit Software Technologies`,
  description: "Get in touch with BellBit to discuss your next software project.",
  openGraph: {
    title: `Contact Us | BellBit Software Technologies`,
    description: "Get in touch with BellBit to discuss your next software project.",
    url: "https://bell-bit.com/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <ContactSection />
      <Footer />
    </>
  );
}
