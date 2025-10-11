// Simple seed script for community posts
// This creates mock data that will be stored in AsyncStorage

const seedPosts = [
  {
    title: "Finding My Voice Through AAC",
    subtitle: "A journey from silence to self-expression",
    content: [
      "After my stroke at 45, I thought I'd never communicate again. The words were trapped in my mind, but my body wouldn't cooperate. I felt isolated, frustrated, and hopeless.",
      "My speech therapist introduced me to AAC (Augmentative and Alternative Communication) apps. At first, I resisted - it felt like giving up on my voice. But slowly, I began to see it as a bridge, not a barrier.",
      "With Proloquo2Go, I could finally express my needs, share my feelings, and even tell jokes again. My family learned to be patient, to give me time to construct my thoughts.",
      "Now, two years later, I'm not just communicating - I'm thriving. I've joined online communities, started a blog about my journey, and even given a TEDx talk about AAC awareness.",
      "The app didn't replace my voice; it gave me a new one. And that voice has become my most powerful tool for advocacy and connection."
    ],
    image: "community-read-1.png",
    author: "Sarah Chen",
    authorId: "seed_user_1",
    category: "Communication"
  },
  {
    title: "Dancing Beyond Limits",
    subtitle: "How adaptive dance changed my perspective",
    content: [
      "I've always loved music and movement, but after my accident, I thought my dancing days were over. The wheelchair felt like a prison, limiting not just my mobility but my spirit.",
      "Then I discovered adaptive dance classes at our local community center. The instructor, Maria, saw potential where I saw limitations. She taught me that dance isn't about your legs - it's about your heart.",
      "We adapted every move. My arms became my primary expression, my wheelchair an extension of my body. We used scarves, ribbons, and even the chair itself as props.",
      "The first time I performed in front of an audience, I was terrified. But as the music started, something magical happened. I wasn't just moving - I was flying.",
      "Now I teach adaptive dance to other wheelchair users. Every class, I see that same transformation - from doubt to confidence, from limitation to liberation. Dance gave me back my joy, and now I get to share it."
    ],
    image: "community-2.png",
    author: "Marcus Rodriguez",
    authorId: "seed_user_2",
    category: "Physical & Mobility"
  },
  {
    title: "From Overwhelm to Organization",
    subtitle: "How ADHD tools transformed my daily life",
    content: [
      "For 30 years, I felt like I was drowning in my own mind. Tasks would pile up, deadlines would slip by, and I'd beat myself up for 'not trying hard enough.'",
      "Getting diagnosed with ADHD at 32 was both a relief and a challenge. Finally, I had an explanation, but I still needed solutions.",
      "I started with simple tools: visual timers, color-coded calendars, and the Pomodoro technique. But the real game-changer was finding an app that worked with my brain, not against it.",
      "Todoist became my external brain. I set up projects, broke them into tiny steps, and used due dates as guardrails rather than stress triggers.",
      "Now I'm not just managing my ADHD - I'm leveraging it. My hyperfocus becomes a superpower for creative projects. My need for variety drives innovation in my work.",
      "The key wasn't trying to be neurotypical. It was finding tools that celebrated my neurodivergent brain and helped it thrive."
    ],
    image: "community-posting.png",
    author: "Alex Kim",
    authorId: "seed_user_3",
    category: "Cognitive & Learning"
  },
  {
    title: "Seeing the World Differently",
    subtitle: "My journey with visual impairment and technology",
    content: [
      "When I was diagnosed with retinitis pigmentosa at 25, I was terrified. The gradual loss of my sight felt like losing my independence, my career, my future.",
      "But my orientation and mobility instructor, David, had a different perspective. 'You're not losing sight,' he said, 'you're gaining a new way of seeing.'",
      "He introduced me to assistive technology that I never knew existed. Screen readers, voice assistants, and apps that could identify objects, read text, and even describe scenes.",
      "The iPhone's VoiceOver feature became my gateway to independence. I could text, email, navigate, and even take photos that the phone would describe to me.",
      "Now, five years later, I work as a disability advocate and accessibility consultant. I help companies make their products more inclusive, turning my challenge into my calling.",
      "I've learned that sight isn't just visual - it's about understanding, empathy, and seeing possibilities where others see limitations."
    ],
    image: "community-read-2.png",
    author: "Priya Patel",
    authorId: "seed_user_4",
    category: "Visual"
  },
  {
    title: "Breaking the Silence",
    subtitle: "How I learned to advocate for myself with hearing loss",
    content: [
      "For most of my life, I pretended I could hear perfectly. I'd nod and smile, even when I missed half the conversation. The shame felt heavier than the hearing aids.",
      "In college, I met other students with hearing loss who weren't hiding. They were proud, vocal, and unapologetic about their needs. It was revolutionary.",
      "I learned to advocate for myself: asking for captions, requesting quiet spaces for conversations, and educating others about hearing loss.",
      "The turning point came when I started a blog about my experiences. Suddenly, I wasn't alone in my struggles. Other people with hearing loss reached out, sharing their stories.",
      "Now I work as a deaf awareness trainer, helping organizations create more inclusive environments. My 'disability' became my expertise, my difference became my strength.",
      "The silence I once feared became the silence I chose - the quiet confidence of knowing who I am and what I need."
    ],
    image: "community-3.png",
    author: "Jordan Lee",
    authorId: "seed_user_5",
    category: "Hearing"
  }
];

// Create the seeded posts with proper structure
const now = new Date();
const seededPosts = seedPosts.map((post, index) => ({
  ...post,
  _id: `seed_post_${index + 1}_${now.getTime()}`,
  likes: 0,
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
}));

console.log('🌱 Community posts seed data created!');
console.log(`📊 Total posts: ${seededPosts.length}`);
console.log('📂 Categories:', [...new Set(seededPosts.map(p => p.category))].join(', '));
console.log('\n📝 Sample post:');
console.log(JSON.stringify(seededPosts[0], null, 2));

// Export for use in the app
module.exports = { seedPosts: seededPosts };