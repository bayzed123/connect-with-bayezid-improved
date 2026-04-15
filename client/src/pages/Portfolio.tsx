import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ChevronRight, Briefcase, Target, Award, Users, TrendingUp, Code, Zap, Shield, CheckCircle } from "lucide-react";

/**
 * Design Philosophy: Professional Portfolio
 * - Premium personal branding
 * - Showcase expertise and achievements
 * - Professional imagery and layout
 * - Clear call-to-action
 */

export default function Portfolio() {
  const skills = [
    {
      category: "Digital Marketing",
      icon: Target,
      items: [
        "ROI-Driven Campaign Strategy",
        "Facebook & Instagram Advertising",
        "Advanced Audience Targeting",
        "Full-Funnel Marketing",
        "Cost Per Acquisition Optimization",
        "Revenue Scaling",
      ],
    },
    {
      category: "Meta Technical Solutions",
      icon: Code,
      items: [
        "Meta Business Manager Recovery",
        "Disabled Ad Account Resolution",
        "Meta Pixel Implementation",
        "Conversion API (CAPI) Setup",
        "Domain Verification",
        "Aggregated Event Measurement",
      ],
    },
    {
      category: "Digital Asset Management",
      icon: Shield,
      items: [
        "Meta Business Suite Security",
        "Policy Compliance Auditing",
        "High-Value Asset Management",
        "Account Recovery & Restoration",
        "Technical Infrastructure Setup",
        "Risk Mitigation & Prevention",
      ],
    },
  ];

  const achievements = [
    {
      number: "150+",
      label: "Projects Completed",
      description: "Successfully delivered digital solutions across multiple industries",
    },
    {
      number: "50+",
      label: "Happy Clients",
      description: "Building lasting relationships through exceptional service",
    },
    {
      number: "5+",
      label: "Years Experience",
      description: "Proven track record in digital marketing and technical expertise",
    },
    {
      number: "98%",
      label: "Client Satisfaction",
      description: "Consistently exceeding expectations and delivering results",
    },
  ];

  const expertise = [
    {
      title: "Digital Marketing Mastery",
      description: "As a Digital Marketer, I specialize in high-ROI strategies that drive real business growth. My approach combines data-driven insights with creative execution to maximize your marketing investment.",
      highlights: [
        "Planning and executing ROI-driven Facebook and Instagram ad campaigns",
        "Conducting advanced audience research and precision interest targeting",
        "Developing full-funnel marketing strategies from Awareness to Conversion",
        "Optimizing ad spend to reduce Cost Per Acquisition (CPA)",
        "Scaling business revenue through performance marketing",
      ],
    },
    {
      title: "Meta Technical Expertise",
      description: "As a verified Tech Provider, I specialize in solving complex technical issues within the Meta ecosystem. I provide permission-based, policy-following solutions that secure and optimize your digital assets.",
      highlights: [
        "Recovering restricted Meta Business Managers and disabled Ad Accounts",
        "Implementing Meta Pixel and Conversion API (CAPI) via Server-Side tracking",
        "Resolving domain verification and Aggregated Event Measurement issues",
        "Auditing digital assets for Meta Advertising Policy compliance",
        "Securing and managing high-value Meta Business Suite infrastructures",
      ],
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        {/* Breadcrumb */}
        <div className="w-full px-4 py-6">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Portfolio</span>
          </div>
        </div>

        {/* Hero Section with Profile */}
        <section className="w-full px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left: Profile Image */}
              <div className="flex justify-center md:justify-start">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-2xl opacity-40" />
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663557681386/8DCdz46vKMnJXpqVqTsHd3/IMG_1079_5ee031ae.PNG"
                    alt="Sayad Md Bayezid Hosan"
                    className="relative w-full max-w-md rounded-2xl shadow-2xl object-cover"
                  />
                </div>
              </div>

              {/* Right: Profile Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                    Sayad Md Bayezid Hosan
                  </h1>
                  <p className="text-2xl text-indigo-300 font-semibold mb-2">
                    Digital Marketing Specialist & Meta Tech Provider
                  </p>
                  <p className="text-lg text-slate-300">
                    Founder at Connect With Bayezid | Tech Agency
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-slate-300 leading-relaxed">
                    I'm a results-driven digital marketer and verified Meta Tech Provider specializing in high-ROI marketing strategies and complex technical solutions within the Meta ecosystem. With a passion for solving real business challenges, I combine technical expertise with creative marketing to deliver measurable growth.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    My mission is to help businesses unlock their digital potential through strategic marketing, secure technical infrastructure, and transparent, policy-following practices.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a
                    href="https://wa.me/message/TDYG575YENF6F1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105"
                  >
                    Work With Me
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                  >
                    Get In Touch
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="w-full px-4 py-16 md:py-24 bg-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-16">Track Record</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center hover:border-indigo-500/50 transition-all hover:bg-white/10"
                >
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
                    {achievement.number}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{achievement.label}</h3>
                  <p className="text-slate-400 text-sm">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Expertise Sections */}
        <section className="w-full px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto space-y-16">
            {expertise.map((section, index) => (
              <div key={index} className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-4">{section.title}</h2>
                  <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                    {section.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex gap-4">
                      <CheckCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                      <p className="text-slate-300">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Presentation & Speaking Section */}
        <section className="w-full px-4 py-16 md:py-24 bg-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-2xl opacity-30" />
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663557681386/8DCdz46vKMnJXpqVqTsHd3/IMG_1081_d105d305.PNG"
                    alt="Digital Marketing Ecosystem Presentation"
                    className="relative w-full rounded-2xl shadow-2xl object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-4">Thought Leadership & Speaking</h2>
                  <p className="text-lg text-slate-300 leading-relaxed">
                    As a recognized expert in digital marketing and Meta technical solutions, I actively share knowledge through presentations, workshops, and educational content. My approach combines strategic insights with practical implementation guidance.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-bold mb-1">Digital Marketing Ecosystem Mastery</h3>
                      <p className="text-slate-300 text-sm">Comprehensive frameworks for understanding and optimizing the entire digital marketing funnel</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-bold mb-1">Meta Ecosystem Expertise</h3>
                      <p className="text-slate-300 text-sm">In-depth knowledge of Facebook, Instagram, and Meta Business Suite technical implementation</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-bold mb-1">Data-Driven Strategy</h3>
                      <p className="text-slate-300 text-sm">Practical methodologies for converting data insights into actionable marketing strategies</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-bold mb-1">Real-World Case Studies</h3>
                      <p className="text-slate-300 text-sm">Proven success stories and lessons learned from 150+ completed projects</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Grid */}
        <section className="w-full px-4 py-16 md:py-24 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-16">Core Competencies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {skills.map((skillGroup, index) => {
                const Icon = skillGroup.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-indigo-500/50 transition-all hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{skillGroup.category}</h3>
                    </div>

                    <ul className="space-y-3">
                      {skillGroup.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-slate-300 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Professional Headshot Section */}
        <section className="w-full px-4 py-16 md:py-24 bg-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-6 order-2 md:order-1">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-4">Professional Excellence</h2>
                  <p className="text-lg text-slate-300 leading-relaxed">
                    With a commitment to delivering exceptional results, I bring professionalism, integrity, and expertise to every project. My approach combines strategic thinking with hands-on execution to ensure your digital success.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-bold mb-1">Client-Centric Approach</h3>
                      <p className="text-slate-300 text-sm">Your success is my priority. I work closely with clients to understand their goals and deliver tailored solutions.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-bold mb-1">Continuous Learning</h3>
                      <p className="text-slate-300 text-sm">Staying updated with the latest trends and technologies to provide cutting-edge solutions.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-bold mb-1">Transparent Communication</h3>
                      <p className="text-slate-300 text-sm">Clear, honest communication throughout the entire project lifecycle for complete transparency.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-bold mb-1">Results-Driven</h3>
                      <p className="text-slate-300 text-sm">Focused on delivering measurable results that directly impact your business growth and ROI.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Headshot */}
              <div className="flex justify-center order-1 md:order-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-2xl opacity-30" />
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663557681386/8DCdz46vKMnJXpqVqTsHd3/IMG_1078_4329269e.PNG"
                    alt="Sayad Md Bayezid Hosan - Professional Headshot"
                    className="relative w-full max-w-md rounded-2xl shadow-2xl object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="w-full px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-12">Education & Background</h2>

            <div className="space-y-8">
              {/* Education */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">B.A. (Honors) in English</h3>
                    <p className="text-indigo-300 font-semibold mb-2">Northern University Bangladesh (NUB)</p>
                    <p className="text-slate-300">
                      Final-year undergraduate student with expected graduation in June 2026. Strong academic foundation combined with practical professional experience in digital marketing and technical solutions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Journey */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Professional Journey</h3>
                    <p className="text-slate-300 mb-4">
                      As a verified Tech Provider within the Meta ecosystem, I've built a reputation for solving complex technical challenges with integrity and transparency. My approach combines:
                    </p>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                        Policy-following and compliant technical solutions
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                        Privacy-respecting practices and transparent communication
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                        Data-driven marketing strategies that deliver measurable ROI
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                        Dedicated support and ongoing optimization for client success
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Working Style Section */}
        <section className="w-full px-4 py-16 md:py-24 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Lifestyle Image */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-2xl opacity-30" />
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663557681386/8DCdz46vKMnJXpqVqTsHd3/IMG_1083_3995bfc6.PNG"
                    alt="Working at a cafe - Creative workspace"
                    className="relative w-full rounded-2xl shadow-2xl object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-4">Work Style & Approach</h2>
                  <p className="text-lg text-slate-300 leading-relaxed">
                    I believe in flexible, creative work environments that foster innovation and productivity. Whether working from a modern office or a collaborative café, my focus remains on delivering exceptional results for every client.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-bold mb-1">Flexible & Adaptive</h3>
                      <p className="text-slate-300 text-sm">Comfortable working across different environments and time zones to meet your project needs.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-bold mb-1">Creative Problem Solving</h3>
                      <p className="text-slate-300 text-sm">Approaching challenges with fresh perspectives and innovative solutions that drive results.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-bold mb-1">Focused Execution</h3>
                      <p className="text-slate-300 text-sm">Maintaining high productivity and attention to detail regardless of the work environment.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-bold mb-1">Always Connected</h3>
                      <p className="text-slate-300 text-sm">Staying responsive and available to support your project success at all times.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Digital Presence?</h2>
            <p className="text-lg text-slate-300 mb-10">
              Let's work together to achieve your business goals through strategic marketing and technical excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/message/TDYG575YENF6F1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105"
              >
                Start a Project
              </a>
              <Link
                href="/customer-agreement"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
              >
                View Pricing & Terms
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
