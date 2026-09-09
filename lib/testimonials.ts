export const testimonials = [
  {
    id: "ashine",
    quote:
      "BellBit is reliable, responsive, and easy to work with. They always find practical solutions.",
    author: "Ashine",
    role: "Client Partner",
    avatar: "/assets/bellbit/testimonials/Ashine.jpg",
  },
  {
    id: "dr-mersia",
    quote:
      "The kids at BellBit are very energetic and eager to learn and do more. It's great to see their enthusiasm and growth.",
    author: "Dr. Mersia",
    role: "Healthcare Partner",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Dr%20Mersia&backgroundColor=1a1f2b&textColor=e8ecf4",
  },
  {
    id: "yonatan",
    quote: "Great team, great support, and easy to work with.",
    author: "Yonatan",
    role: "Client Partner",
    avatar: "/assets/bellbit/testimonials/Yonatan.jpg",
  },
  {
    id: "dr-woubetu",
    quote:
      "BellBit delivered our website on time, and we were really happy with the final result. They understood what we wanted and did a great job.",
    author: "Dr. Woubetu",
    role: "Guansa PLC",
    avatar: "/assets/bellbit/testimonials/Dr%20Woubetu.jpg",
  },
  {
    id: "dr-michael",
    quote:
      "I taught them before and was proud to be their teacher. Now, I'm very happy to be working with them and seeing what they're building.",
    author: "Dr. Michael",
    role: "Academic Collaborator",
    avatar: "/assets/bellbit/testimonials/Dr%20Michael.png",
  },
] as const;

export type Testimonial = (typeof testimonials)[number];
