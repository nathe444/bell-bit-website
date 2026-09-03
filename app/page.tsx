import { Hero } from "@/sections/Hero/Hero";
import { Trust } from "@/sections/Trust/Trust";
import { Services } from "@/sections/Services/Services";
import { Projects } from "@/sections/Projects/Projects";
import { WhyBellBit } from "@/sections/WhyBellBit/WhyBellBit";
import { Technology } from "@/sections/Technology/Technology";
import { Industries } from "@/sections/Industries/Industries";
import { Testimonials } from "@/sections/Testimonials/Testimonials";
import { CTA } from "@/sections/CTA/CTA";
import { Footer } from "@/sections/Footer/Footer";
import { company, contact } from "@/lib/content";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description: company.overview,
    email: contact.email,
    telephone: contact.phonePrimary,
    foundingDate: "2024-10-01",
    url: "https://bell-bit.com",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />
      <Trust />
      <Services />
      <Projects />
      <WhyBellBit />
      <Technology />
      <Industries />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
