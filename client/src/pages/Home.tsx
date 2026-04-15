import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ArrowRight, Zap, Users, TrendingUp, Code, Star } from "lucide-react";

/**
 * Design Philosophy: Modern Professional with Gradient Elegance
 * - Maintains the original gradient background aesthetic
 * - Adds professional navigation and footer
 * - Uses smooth animations and hover effects
 * - Emphasizes clarity and visual hierarchy
 */

export default function Home() {
  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Custom websites and applications built with modern technologies",
      color: "from-indigo-500 to-blue-600",
    },
    {
      icon: Zap,
      title: "Digital Strategy",
      description: "Strategic planning for your digital growth and online presence",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Users,
      title: "Social Media",
      description: "Engaging content and community management across platforms",
      color: "from-cyan-500 to-teal-600",
    },
    {
      icon: TrendingUp,
      title: "SEO & Marketing",
      description: "Boost your visibility and reach your target audience effectively",
      color: "from-amber-500 to-orange-600",
    },
  ];

  const features = [
    "Professional & Responsive Design",
    "SEO Optimized",
    "Fast Performance",
    "Mobile First Approach",
    "24/7 Support",
    "Scalable Solutions",
  ];

  const testimonials = [
    {
      name: "Abdullah Al Zamil",
      feedback: "Brother is very sincere and hardworking. I had an issue with boosting on my page, and he took the time to resolve it. Thank you, Freelancer Bayezid bhai. ❤️",
      rating: 5,
      link: "https://www.facebook.com/share/1S2Y9HzGm5/?mibextid=wwXIfr",
    },
    {
      name: "Golam Rabbi",
      feedback: "I was really stressed about my page issue and had no idea what to do. Then I contacted Bayezid bhai, and he fixed everything within just 3 hours! 100% trusted, highly recommended.",
      rating: 5,
      link: "https://www.facebook.com/share/18bXXKZ6D5/?mibextid=wwXIfr",
    },
    {
      name: "Md Imran Sarder",
      feedback: "Professional Solution for Facebook Payout Issues! He set up the payout account correctly, successfully resolved earning complications, and fixed the entire issue with great efficiency.",
      rating: 5,
      link: "https://www.facebook.com/share/1Cp78j27sh/?mibextid=wwXIfr",
    },
    {
      name: "Golam Kibria",
      feedback: "My page's monetization was restricted due to 'Local Legal Requirements.' Bayezid bhai handled everything very professionally and resolved my issue very quickly. 100% trusted!",
      rating: 5,
      link: "https://www.facebook.com/share/1FpXKyAaQk/?mibextid=wwXIfr",
    },
    {
      name: "Rashid Mahmud Babu",
      feedback: "For quite some time, I was struggling with multiple issues on my ID—nothing seemed to work at all. But my dear brother, with his own skills, beautifully solved my problems. Thank you so much!",
      rating: 5,
      link: "https://www.facebook.com/share/1FzcGtKvag/?mibextid=wwXIfr",
    },
    {
      name: "Ariful",
      feedback: "I'm getting excellent results from Facebook ad campaigns, and all the credit goes to Freelancer Bayezid's service. There's great consistency between what he says and what he delivers. Very friendly and supportive at every step!",
      rating: 5,
      link: "https://www.facebook.com/share/183BLLHRVP/?mibextid=wwXIfr",
    },
    {
      name: "Coy Pixy",
      feedback: "He is very professional and his attention to detail is amazing. The work was much better than I expected. He helped with design, post writing, page boost, etc. very efficiently. Always answered my questions and gave suggestions when needed.",
      rating: 5,
      link: "https://www.facebook.com/share/17uU7Gk3RQ/?mibextid=wwXIfr",
    },
    {
      name: "Elias Mizi",
      feedback: "After my ID was locked for 18 days, I couldn't recover it. With Bayezid bhai's skill, patience, and by following Facebook's guidelines, he fully assisted me in recovering my lost account. I'm truly grateful!",
      rating: 5,
      link: "https://www.facebook.com/share/1BpjBSmS51/?mibextid=wwXIfr",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8 animate-fadeInScale">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-5xl font-bold text-white">CWB</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 animate-slideInUp">
              Welcome to Connect With Bayezid
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-indigo-300 font-medium mb-6 animate-slideInUp" style={{ animationDelay: "0.1s" }}>
              Your Digital Growth Partner
            </p>

            {/* Description */}
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-10 animate-slideInUp" style={{ animationDelay: "0.2s" }}>
              Explore our comprehensive services, portfolio, and discover why clients trust us for their digital success
            </p>

            {/* Recommended Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg mb-12 animate-float">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white font-bold text-sm md:text-base">Best Learn - Recommended</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105">
                Explore Our Blog
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="https://wa.me/message/TDYG575YENF6F1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="w-full px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-2"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-sm text-slate-300">{service.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full px-4 py-16 md:py-24 bg-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full px-4 py-16 md:py-24 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Client Success Stories</h2>
            <p className="text-center text-slate-300 mb-12 max-w-2xl mx-auto">Real feedback from satisfied clients who trusted us with their digital challenges</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <a
                  key={index}
                  href={testimonial.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-2 hover:border-indigo-500/50"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Feedback */}
                  <p className="text-slate-300 text-sm mb-4 line-clamp-4 group-hover:line-clamp-none transition-all">
                    "{testimonial.feedback}"
                  </p>

                  {/* Name */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-sm">{testimonial.name}</p>
                      <p className="text-indigo-400 text-xs">Verified Client</p>
                    </div>
                    <div className="text-indigo-400 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Grow Your Digital Presence?</h2>
            <p className="text-lg text-slate-300 mb-10">Let's work together to bring your vision to life</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105">
                Explore Blog
              </Link>
              <a href="https://wa.me/message/TDYG575YENF6F1" target="_blank" rel="noopener noreferrer" className="px-8 py-4 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                Chat on WhatsApp
              </a>
              <a href="https://www.facebook.com/share/1GYmMYYNXz/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="px-8 py-4 border border-blue-500/30 text-white font-bold rounded-xl hover:bg-blue-500/10 transition-all">
                Visit Facebook Page
              </a>
              <a href="https://www.genzfrontir.com" target="_blank" rel="noopener noreferrer" className="px-8 py-4 border border-amber-500/30 text-white font-bold rounded-xl hover:bg-amber-500/10 transition-all">
                GenZ Frontier News
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.6s ease-out;
        }

        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-none {
          display: block;
          -webkit-line-clamp: unset;
        }
      `}</style>
    </div>
  );
}
