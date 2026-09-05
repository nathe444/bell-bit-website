/**
 * Demo testimonial copy for the showcase UI.
 * Replace entries with verified client quotes when available.
 */

export const testimonials = [
  {
    id: "alex-techcorp",
    quote: "My favorite solution in the market. We work 5x faster with BellBit.",
    author: "Alex",
    role: "CEO at TechCorp",
    avatar:
      "https://cdn.21st.dev/assets/mirror/f0/f02fed36023656a5b5df6f247c83c96c53bfa9db5b98085cdee93ffc938a5f37.jpg",
  },
  {
    id: "dan-securenet",
    quote:
      "I'm confident our systems are in safe hands with BellBit. I can't say that about other providers.",
    author: "Dan",
    role: "CTO at SecureNet",
    avatar:
      "https://cdn.21st.dev/assets/mirror/5b/5b5b2f3487692d40f629010ea6448d150907f780d8c262c4ca194b7386115c2d.jpg",
  },
  {
    id: "stephanie-innovate",
    quote: "We were lost before we found BellBit. Can't thank you guys enough.",
    author: "Stephanie",
    role: "COO at InnovateCo",
    avatar:
      "https://cdn.21st.dev/assets/mirror/10/10e2bfa5446e5c116e269b649b5f5e0106d96643f0a903048f3a056e40c35cd8.jpg",
  },
  {
    id: "marie-future",
    quote: "BellBit makes planning for the future seamless. Can't recommend them enough.",
    author: "Marie",
    role: "CFO at FuturePlanning",
    avatar:
      "https://cdn.21st.dev/assets/mirror/fa/fae47bb0faba45d1e0696b6557ca36c551a738c7d6e3950e82bb69dd2f963a72.jpg",
  },
  {
    id: "andre-creative",
    quote: "If I could give 11 stars, I'd give 12.",
    author: "Andre",
    role: "Head of Design at CreativeSolutions",
    avatar:
      "https://cdn.21st.dev/assets/mirror/4f/4fb45af36b546e069b72527fdf4d904855a2b11b301fa738c8bc4d235595c4df.jpg",
  },
] as const;

export type Testimonial = (typeof testimonials)[number];
