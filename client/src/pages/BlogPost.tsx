import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, useParams } from "wouter";
import { Calendar, User, ChevronRight, ArrowLeft } from "lucide-react";

/**
 * Design Philosophy: Professional Blog Article
 * - Clean, readable typography for long-form content
 * - Consistent with site design using gradient accents
 * - Easy navigation with breadcrumbs and related posts
 * - Accessible article layout
 */

interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
}

const blogPostsData: Record<string, BlogPostData> = {
  "getting-started-with-web-development": {
    slug: "getting-started-with-web-development",
    title: "Getting Started with Web Development",
    excerpt: "Learn the fundamentals of web development and start your journey as a developer.",
    content: `
      <h2>Introduction to Web Development</h2>
      <p>Web development is an exciting field that combines creativity with technical skills. Whether you're interested in building websites, web applications, or becoming a full-stack developer, this guide will help you get started.</p>

      <h2>The Three Pillars of Web Development</h2>
      <h3>1. HTML - The Structure</h3>
      <p>HTML (HyperText Markup Language) is the foundation of all websites. It provides the structure and content of web pages. HTML uses tags to define different elements like headings, paragraphs, links, and images.</p>

      <h3>2. CSS - The Styling</h3>
      <p>CSS (Cascading Style Sheets) is used to style and layout web pages. With CSS, you can control colors, fonts, spacing, and positioning of elements. Modern CSS frameworks like Tailwind CSS make styling even easier.</p>

      <h3>3. JavaScript - The Interactivity</h3>
      <p>JavaScript is a programming language that adds interactivity to web pages. It allows you to create dynamic content, handle user interactions, and build complex web applications.</p>

      <h2>Getting Started</h2>
      <p>To begin your web development journey, start by learning HTML basics. Then move on to CSS to make your pages look beautiful. Finally, learn JavaScript to add interactivity. Practice by building small projects and gradually increase the complexity.</p>

      <h2>Resources for Learning</h2>
      <p>There are many excellent resources available online including tutorials, courses, and documentation. Websites like MDN Web Docs, freeCodeCamp, and Codecademy offer comprehensive learning materials.</p>
    `,
    author: "Bayezid",
    date: "April 10, 2026",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    readTime: "5 min read",
  },
  "digital-marketing-strategies-2026": {
    slug: "digital-marketing-strategies-2026",
    title: "Digital Marketing Strategies for 2026",
    excerpt: "Discover the most effective digital marketing strategies that will help your business grow.",
    content: `
      <h2>The Digital Marketing Landscape in 2026</h2>
      <p>Digital marketing continues to evolve rapidly. To stay competitive, businesses need to adapt their strategies and embrace new technologies and platforms.</p>

      <h2>Key Digital Marketing Strategies</h2>
      <h3>1. Content Marketing</h3>
      <p>Creating valuable, relevant content is crucial for attracting and retaining customers. Focus on providing solutions to your audience's problems through blogs, videos, and other content formats.</p>

      <h3>2. Social Media Marketing</h3>
      <p>Social media platforms are essential for reaching your audience. Develop a consistent posting schedule, engage with your followers, and use analytics to optimize your strategy.</p>

      <h3>3. Search Engine Optimization (SEO)</h3>
      <p>SEO helps your website rank higher in search results. Focus on keyword research, quality content, and technical optimization to improve your visibility.</p>

      <h3>4. Email Marketing</h3>
      <p>Email remains one of the most effective marketing channels. Build your email list and send targeted, personalized messages to nurture relationships with your audience.</p>

      <h2>Measuring Success</h2>
      <p>Use analytics tools to track your marketing performance. Monitor metrics like traffic, conversion rates, and engagement to understand what's working and what needs improvement.</p>
    `,
    author: "Bayezid",
    date: "April 8, 2026",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
    readTime: "7 min read",
  },
  "mobile-first-design-principles": {
    slug: "mobile-first-design-principles",
    title: "Mobile-First Design Principles",
    excerpt: "Understand why mobile-first design is essential in today's digital landscape.",
    content: `
      <h2>Why Mobile-First Design Matters</h2>
      <p>With the majority of web traffic coming from mobile devices, designing for mobile first is no longer optional—it's essential. Mobile-first design ensures your website works great on all devices.</p>

      <h2>Core Mobile-First Principles</h2>
      <h3>1. Start with the Mobile Experience</h3>
      <p>Begin your design process with mobile devices in mind. This forces you to prioritize content and functionality, resulting in a cleaner, more focused design.</p>

      <h3>2. Progressive Enhancement</h3>
      <p>Build a solid foundation for mobile, then enhance the experience for larger screens. This approach ensures everyone gets a functional experience, regardless of device.</p>

      <h3>3. Touch-Friendly Interfaces</h3>
      <p>Design buttons and interactive elements with touch in mind. Make sure they're large enough to tap easily and have adequate spacing to prevent accidental clicks.</p>

      <h3>4. Performance Optimization</h3>
      <p>Mobile users often have slower connections. Optimize images, minimize code, and use efficient techniques to ensure fast loading times.</p>

      <h2>Implementation Tips</h2>
      <p>Use CSS media queries to create responsive layouts. Test your designs on real devices, not just browser emulators. Use tools like Google's Mobile-Friendly Test to verify your implementation.</p>
    `,
    author: "Bayezid",
    date: "April 5, 2026",
    category: "Design",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&h=500&fit=crop",
    readTime: "6 min read",
  },
};

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPostsData[slug];

  if (!post) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex flex-col">
        <Header />
        <main className="flex-1 w-full px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Article Not Found</h1>
            <p className="text-slate-300 mb-8">The article you're looking for doesn't exist.</p>
            <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105">
              <ArrowLeft className="w-5 h-5" />
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 w-full px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{post.title}</span>
          </div>

          {/* Article Header */}
          <div className="mb-12">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{post.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <span className="text-slate-500">{post.readTime}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-12 rounded-2xl overflow-hidden border border-white/10">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 mb-12 prose prose-invert max-w-none">
            <div
              className="text-slate-300 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .replace(/<h2>/g, '<h2 class="text-3xl font-bold text-white mt-8 mb-4">')
                  .replace(/<h3>/g, '<h3 class="text-xl font-bold text-indigo-300 mt-6 mb-3">')
                  .replace(/<p>/g, '<p class="text-slate-300 leading-relaxed">')
              }}
            />
          </div>

          {/* Author Bio */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-white">B</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">About {post.author}</h3>
                <p className="text-slate-300">
                  Digital growth expert and web development enthusiast. Passionate about helping businesses succeed online through innovative solutions and strategic digital marketing.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105">
              <ArrowLeft className="w-5 h-5" />
              Back to Blog
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
