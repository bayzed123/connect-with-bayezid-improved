import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ChevronRight, Award, Target, Users, Zap, Shield, BookOpen } from "lucide-react";

/**
 * Design Philosophy: About Us Page
 * - Compelling company story with founder background
 * - Clear service offerings with icons
 * - Professional and trustworthy design
 * - Strong call-to-action sections
 */

export default function About() {
  const services = [
    {
      icon: Zap,
      title: "Digital Marketing",
      description: "Data-driven marketing strategies that increase visibility, engagement, and drive measurable business growth.",
    },
    {
      icon: Shield,
      title: "Meta Technical Support",
      description: "Permission-based technical solutions for Facebook/Meta issues. Policy-following, privacy-respecting, transparent.",
    },
    {
      icon: Target,
      title: "SEO Optimization",
      description: "Strategic SEO services to improve your search rankings, drive organic traffic, and enhance online visibility.",
    },
    {
      icon: BookOpen,
      title: "Content Strategy",
      description: "Compelling content that engages your audience and tells your brand story across all platforms.",
    },
    {
      icon: Users,
      title: "Social Media Management",
      description: "Professional social media management that builds community, engagement, and drives brand awareness.",
    },
    {
      icon: Award,
      title: "Business Asset Management",
      description: "Secure management of digital business assets with the highest standards of privacy and integrity.",
    },
  ];

  const stats = [
    { number: "2022", label: "Founded" },
    { number: "100+", label: "Satisfied Clients" },
    { number: "50+", label: "Successful Projects" },
    { number: "24/7", label: "Support Available" },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 w-full px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">About Us</span>
          </div>

          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">About Connect With Bayezid</h1>
            <p className="text-xl text-slate-300 max-w-3xl">
              Your Digital Growth Partner - A leading digital agency and technical consultancy based in Bangladesh, dedicated to solving complex technical issues and driving digital transformation.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-400 mb-2">{stat.number}</div>
                <div className="text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Company Story Section */}
          <div className="mb-16">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-6 text-slate-300 leading-relaxed">
                <p>
                  <strong className="text-white">Connect With Bayezid</strong> is a leading digital agency and technical consultancy based in Bangladesh, founded and led by Sayad Md Bayezid Hosan. We specialize in Digital Marketing, SEO, Content Strategy, and Social Media Management, providing comprehensive solutions for businesses in the digital landscape.
                </p>
                <p>
                  As a verified Tech Provider, we're dedicated to solving complex technical issues within the Meta ecosystem through policy-following and transparent practices. We provide permission-based technical support and business asset management, ensuring the highest standards of privacy and security for our clients.
                </p>
                <p>
                  Founded in <strong className="text-white">January 2022</strong>, we've built a reputation for professional integrity and original production, bridging the gap between technical innovation and digital growth while empowering users with expert tech tips and educational content.
                </p>
              </div>
            </div>
          </div>

          {/* Founder Section */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Founder Image Placeholder */}
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl h-96 flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-5xl font-bold text-white">B</span>
                  </div>
                  <p className="text-slate-300 text-sm">Sayad Md Bayezid Hosan</p>
                </div>
              </div>

              {/* Founder Info */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Meet Our Founder</h2>
                <div className="space-y-6 text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-white">Sayad Md Bayezid Hosan</strong> is a Tech Provider and digital content creator based in Bangladesh. He is currently a final-year undergraduate student in the Department of English at <strong className="text-white">Northern University Bangladesh</strong> (Expected Graduation: June 2026).
                  </p>
                  <p>
                    As a professional within the Meta ecosystem, Bayezid operates as a Technical Expert with a core focus on being policy-following, privacy-respecting, and transparent. He specializes in providing permission-based technical solutions and managing digital business assets with high integrity.
                  </p>
                  <p>
                    In addition to his technical services, he is a dedicated freelancer and content creator who produces educational videos on tech tips and tricks. His goal is to help his audience navigate digital platforms safely and efficiently by combining his academic background with practical technical expertise.
                  </p>
                  <div className="pt-4">
                    <a href="https://www.linkedin.com/in/sayadbayezid" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105">
                      Connect on LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What We Do</h2>
            <p className="text-slate-300 mb-12">Comprehensive digital solutions tailored to your business needs</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, idx) => {
                const Icon = service.icon;
                return (
                  <div key={idx} className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{service.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{service.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Values Section */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Our Core Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-indigo-300 mb-3">🔒 Privacy & Security</h3>
                  <p className="text-slate-300">We prioritize the privacy and security of our clients' data with the highest standards of protection and integrity.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-indigo-300 mb-3">✅ Policy-Following</h3>
                  <p className="text-slate-300">We strictly adhere to all platform policies and regulations, ensuring transparent and compliant operations.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-indigo-300 mb-3">🤝 Transparency</h3>
                  <p className="text-slate-300">We believe in open communication and honest practices in all our business relationships and operations.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-white">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Verified Tech Provider</h3>
                  <p className="text-slate-300">Officially recognized within the Meta ecosystem for technical expertise and policy compliance.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-white">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Expert Team</h3>
                  <p className="text-slate-300">Experienced professionals with deep knowledge in digital marketing, SEO, and technical solutions.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-white">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Proven Results</h3>
                  <p className="text-slate-300">Consistent track record of delivering measurable business growth and digital transformation.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-white">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">24/7 Support</h3>
                  <p className="text-slate-300">Dedicated support team available round-the-clock to assist with your digital needs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Grow Your Digital Presence?</h2>
            <p className="text-indigo-100 mb-8 text-lg">Let's work together to bring your vision to life and achieve your business goals.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-slate-100 transition-all hover:scale-105 text-center">
                Get In Touch
              </Link>
              <a href="https://wa.me/message/TDYG575YENF6F1" target="_blank" rel="noopener noreferrer" className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all hover:scale-105">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
