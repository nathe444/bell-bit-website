/**
 * Demo testimonial copy for the stagger carousel UI.
 * Replace entries with verified client quotes when available.
 */

export const testimonialsSection = {
  eyebrow: "Testimonials",
  title: "What clients say, in their own words.",
} as const;

export const testimonials = [
  {
    id: "alex-techcorp",
    quote: "My favorite solution in the market. We work 5x faster with BellBit.",
    by: "Alex, CEO at TechCorp",
    imgSrc:
      "https://cdn.21st.dev/assets/mirror/f0/f02fed36023656a5b5df6f247c83c96c53bfa9db5b98085cdee93ffc938a5f37.jpg",
  },
  {
    id: "dan-securenet",
    quote: "I'm confident our systems are in safe hands with BellBit. I can't say that about other providers.",
    by: "Dan, CTO at SecureNet",
    imgSrc:
      "https://cdn.21st.dev/assets/mirror/5b/5b5b2f3487692d40f629010ea6448d150907f780d8c262c4ca194b7386115c2d.jpg",
  },
  {
    id: "stephanie-innovate",
    quote: "We were lost before we found BellBit. Can't thank you guys enough.",
    by: "Stephanie, COO at InnovateCo",
    imgSrc:
      "https://cdn.21st.dev/assets/mirror/10/10e2bfa5446e5c116e269b649b5f5e0106d96643f0a903048f3a056e40c35cd8.jpg",
  },
  {
    id: "marie-future",
    quote: "BellBit makes planning for the future seamless. Can't recommend them enough.",
    by: "Marie, CFO at FuturePlanning",
    imgSrc:
      "https://cdn.21st.dev/assets/mirror/fa/fae47bb0faba45d1e0696b6557ca36c551a738c7d6e3950e82bb69dd2f963a72.jpg",
  },
  {
    id: "andre-creative",
    quote: "If I could give 11 stars, I'd give 12.",
    by: "Andre, Head of Design at CreativeSolutions",
    imgSrc:
      "https://cdn.21st.dev/assets/mirror/4f/4fb45af36b546e069b72527fdf4d904855a2b11b301fa738c8bc4d235595c4df.jpg",
  },
  {
    id: "jeremy-timewise",
    quote: "SO happy we found BellBit. I'd bet you've saved me 100 hours so far.",
    by: "Jeremy, Product Manager at TimeWise",
    imgSrc:
      "https://cdn.21st.dev/assets/mirror/a4/a4dd47498f54944edb9cd8095fb751847193faac01d922bae494e68d0cf90f4f.jpg",
  },
  {
    id: "pam-brand",
    quote: "Took some convincing, but now that we're on BellBit, we're never going back.",
    by: "Pam, Marketing Director at BrandBuilders",
    imgSrc:
      "https://cdn.21st.dev/assets/mirror/b2/b2cd3e4ad761fd9954c265df5f86090c4f17c388c07f78332e75edfd7420f66a.jpg",
  },
  {
    id: "daniel-analytics",
    quote: "I would be lost without BellBit's engineering depth. The ROI is easily 100x for us.",
    by: "Daniel, Data Scientist at AnalyticsPro",
    imgSrc:
      "https://cdn.21st.dev/assets/mirror/9a/9a3f3f88dac2ceb807e98d4cbe99acc9813da6d0ce2859b1cf026747727e1667.jpg",
  },
  {
    id: "fernando-ux",
    quote: "It's just the best. Period.",
    by: "Fernando, UX Designer at UserFirst",
    imgSrc:
      "https://cdn.21st.dev/assets/mirror/b7/b78f8c42f62ae61f6ebe5c4e79f3af27f49dc05c4f366d2be599d1e14318be86.jpg",
  },
  {
    id: "andy-cloud",
    quote: "I switched years ago and never looked back.",
    by: "Andy, DevOps Engineer at CloudMasters",
    imgSrc:
      "https://cdn.21st.dev/assets/mirror/45/45482403ecbfd4f326c4388ca63773a1fbe79376213456ae0f422eea1a94d589.jpg",
  },
] as const;

export type Testimonial = (typeof testimonials)[number];
