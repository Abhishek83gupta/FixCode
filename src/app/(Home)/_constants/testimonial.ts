interface Testimonial {
  author: string;
  role: string;
  content: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    author: "Sarah Chen",
    role: "Senior Developer",
    content:
      "The AI suggestions have dramatically improved my coding efficiency. It's like having a senior developer always by my side.",
  },
  {
    author: "James Wilson",
    role: "Full Stack Engineer",
    content:
      "The real-time error detection has saved me countless hours of debugging. This tool is a game-changer.",
  },
  {
    author: "Maria Garcia",
    role: "Tech Lead",
    content:
      "My team's productivity increased by 40% after implementing this AI-powered editor. The collaborative features are exceptional.",
  },
];
