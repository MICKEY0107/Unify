export interface CommunityStory {
  id: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  content?: string[]; // paragraphs
  image?: any;
  author?: string;
  readTime?: number; // in minutes
  category?: string;
  likes?: number;
  date?: string;
}

export const stories: CommunityStory[] = [
  {
    id: "1",
    title: "Finding My Voice Through AAC",
    subtitle: "A journey from silence to self-expression",
    excerpt: "After my stroke, I thought I'd never communicate again. But with the right AAC app and support, I discovered a new way to share my thoughts and connect with others...",
    content: [
      "After my stroke at 45, I thought I'd never communicate again. The words were trapped in my mind, but my body wouldn't cooperate. I felt isolated, frustrated, and hopeless.",
      "My speech therapist introduced me to AAC (Augmentative and Alternative Communication) apps. At first, I resisted - it felt like giving up on my voice. But slowly, I began to see it as a bridge, not a barrier.",
      "With Proloquo2Go, I could finally express my needs, share my feelings, and even tell jokes again. My family learned to be patient, to give me time to construct my thoughts.",
      "Now, two years later, I'm not just communicating - I'm thriving. I've joined online communities, started a blog about my journey, and even given a TEDx talk about AAC awareness.",
      "The app didn't replace my voice; it gave me a new one. And that voice has become my most powerful tool for advocacy and connection."
    ],
    image: require("../../../assets/images/community - Read.png"),
    author: "Sarah Chen",
    readTime: 4,
    category: "Communication",
    likes: 127,
    date: "2024-01-15"
  },
  {
    id: "2",
    title: "Dancing Beyond Limits",
    subtitle: "How adaptive dance changed my perspective",
    excerpt: "Being in a wheelchair didn't stop me from dancing. Through adaptive dance classes, I found a new way to express myself and inspire others...",
    content: [
      "I've always loved music and movement, but after my accident, I thought my dancing days were over. The wheelchair felt like a prison, limiting not just my mobility but my spirit.",
      "Then I discovered adaptive dance classes at our local community center. The instructor, Maria, saw potential where I saw limitations. She taught me that dance isn't about your legs - it's about your heart.",
      "We adapted every move. My arms became my primary expression, my wheelchair an extension of my body. We used scarves, ribbons, and even the chair itself as props.",
      "The first time I performed in front of an audience, I was terrified. But as the music started, something magical happened. I wasn't just moving - I was flying.",
      "Now I teach adaptive dance to other wheelchair users. Every class, I see that same transformation - from doubt to confidence, from limitation to liberation. Dance gave me back my joy, and now I get to share it."
    ],
    image: require("../../../assets/images/community.png"),
    author: "Marcus Rodriguez",
    readTime: 3,
    category: "Physical & Mobility",
    likes: 89,
    date: "2024-01-10"
  },
  {
    id: "3",
    title: "From Overwhelm to Organization",
    subtitle: "How ADHD tools transformed my daily life",
    excerpt: "Living with ADHD felt like constant chaos until I discovered the right tools and strategies. Here's how I turned my biggest challenge into my greatest strength...",
    content: [
      "For 30 years, I felt like I was drowning in my own mind. Tasks would pile up, deadlines would slip by, and I'd beat myself up for 'not trying hard enough.'",
      "Getting diagnosed with ADHD at 32 was both a relief and a challenge. Finally, I had an explanation, but I still needed solutions.",
      "I started with simple tools: visual timers, color-coded calendars, and the Pomodoro technique. But the real game-changer was finding an app that worked with my brain, not against it.",
      "Todoist became my external brain. I set up projects, broke them into tiny steps, and used due dates as guardrails rather than stress triggers.",
      "Now I'm not just managing my ADHD - I'm leveraging it. My hyperfocus becomes a superpower for creative projects. My need for variety drives innovation in my work.",
      "The key wasn't trying to be neurotypical. It was finding tools that celebrated my neurodivergent brain and helped it thrive."
    ],
    image: require("../../../assets/images/community - Posting.png"),
    author: "Alex Kim",
    readTime: 5,
    category: "Cognitive & Learning",
    likes: 156,
    date: "2024-01-08"
  },
  {
    id: "4",
    title: "Seeing the World Differently",
    subtitle: "My journey with visual impairment and technology",
    excerpt: "Losing my sight gradually taught me that vision isn't just about eyes - it's about perspective, adaptation, and finding new ways to experience the world...",
    content: [
      "When I was diagnosed with retinitis pigmentosa at 25, I was terrified. The gradual loss of my sight felt like losing my independence, my career, my future.",
      "But my orientation and mobility instructor, David, had a different perspective. 'You're not losing sight,' he said, 'you're gaining a new way of seeing.'",
      "He introduced me to assistive technology that I never knew existed. Screen readers, voice assistants, and apps that could identify objects, read text, and even describe scenes.",
      "The iPhone's VoiceOver feature became my gateway to independence. I could text, email, navigate, and even take photos that the phone would describe to me.",
      "Now, five years later, I work as a disability advocate and accessibility consultant. I help companies make their products more inclusive, turning my challenge into my calling.",
      "I've learned that sight isn't just visual - it's about understanding, empathy, and seeing possibilities where others see limitations."
    ],
    image: require("../../../assets/images/community - Read.png"),
    author: "Priya Patel",
    readTime: 4,
    category: "Visual",
    likes: 203,
    date: "2024-01-05"
  },
  {
    id: "5",
    title: "Breaking the Silence",
    subtitle: "How I learned to advocate for myself with hearing loss",
    excerpt: "Growing up with hearing loss, I learned to hide it. But embracing my difference and finding my voice changed everything...",
    content: [
      "For most of my life, I pretended I could hear perfectly. I'd nod and smile, even when I missed half the conversation. The shame felt heavier than the hearing aids.",
      "In college, I met other students with hearing loss who weren't hiding. They were proud, vocal, and unapologetic about their needs. It was revolutionary.",
      "I learned to advocate for myself: asking for captions, requesting quiet spaces for conversations, and educating others about hearing loss.",
      "The turning point came when I started a blog about my experiences. Suddenly, I wasn't alone in my struggles. Other people with hearing loss reached out, sharing their stories.",
      "Now I work as a deaf awareness trainer, helping organizations create more inclusive environments. My 'disability' became my expertise, my difference became my strength.",
      "The silence I once feared became the silence I chose - the quiet confidence of knowing who I am and what I need."
    ],
    image: require("../../../assets/images/community.png"),
    author: "Jordan Lee",
    readTime: 3,
    category: "Hearing",
    likes: 94,
    date: "2024-01-03"
  }
];

// Add error handling
export default stories || [];
