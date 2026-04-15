import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, CheckCircle, Zap, Trophy } from "lucide-react";

/**
 * Design Philosophy: Certificates & Achievements
 * - Professional credential showcase
 * - Visual hierarchy for certificates
 * - Interactive certificate gallery
 * - Achievement timeline
 */

export default function Certificates() {
  const certificates = [
    {
      id: 1,
      title: "Meta Technical Certification",
      issuer: "Meta/Facebook",
      date: "2024",
      description: "Advanced technical expertise in Meta Business Manager and advertising solutions",
      imageUrl: "https://drive.google.com/thumbnail?id=1eNVO8plAN-FW3fxGgG2hVfttb4DSdbfo&sz=w1000",
      link: "https://drive.google.com/file/d/1eNVO8plAN-FW3fxGgG2hVfttb4DSdbfo/view?usp=sharing",
    },
    {
      id: 2,
      title: "Digital Marketing Excellence",
      issuer: "Professional Development Institute",
      date: "2024",
      description: "Comprehensive digital marketing strategy and campaign management certification",
      imageUrl: "https://drive.google.com/thumbnail?id=14JjcjRdx2kyFoBitIKUMR5987bz1RGuv&sz=w1000",
      link: "https://drive.google.com/file/d/14JjcjRdx2kyFoBitIKUMR5987bz1RGuv/view?usp=sharing",
    },
    {
      id: 3,
      title: "Advanced SEO Specialist",
      issuer: "Digital Marketing Academy",
      date: "2023",
      description: "Expert-level search engine optimization and organic growth strategies",
      imageUrl: "https://drive.google.com/thumbnail?id=1RORP6FbYtWUjtw6QmA0TMKmsPwqEZnq2&sz=w1000",
      link: "https://drive.google.com/file/d/1RORP6FbYtWUjtw6QmA0TMKmsPwqEZnq2/view?usp=sharing",
    },
    {
      id: 4,
      title: "Content Strategy Mastery",
      issuer: "Content Marketing Institute",
      date: "2023",
      description: "Professional content creation and distribution strategy certification",
      imageUrl: "https://drive.google.com/thumbnail?id=1RORP6FbYtWUjtw6QmA0TMKmsPwqEZnq2&sz=w1000",
      link: "https://drive.google.com/file/d/1RORP6FbYtWUjtw6QmA0TMKmsPwqEZnq2/view?usp=sharing",
    },
    {
      id: 5,
      title: "Social Media Management Pro",
      issuer: "Social Media Marketing Institute",
      date: "2023",
      description: "Advanced social media strategy and community management expertise",
      imageUrl: "https://drive.google.com/thumbnail?id=1RORP6FbYtWUjtw6QmA0TMKmsPwqEZnq2&sz=w1000",
      link: "https://drive.google.com/file/d/1RORP6FbYtWUjtw6QmA0TMKmsPwqEZnq2/view?usp=sharing",
    },
  ];

  const achievements = [
    {
      year: "2022",
      title: "Founded Connect With Bayezid",
      description: "Launched digital agency with focus on Meta technical solutions and digital marketing",
      icon: Trophy,
    },
    {
      year: "2023",
      title: "Reached 1,000+ Satisfied Clients",
      description: "Milestone achievement serving diverse clients across multiple industries",
      icon: CheckCircle,
    },
    {
      year: "2024",
      title: "Became Verified Meta Tech Provider",
      description: "Official recognition as trusted technical expert within Meta ecosystem",
      icon: Award,
    },
    {
      year: "2024",
      title: "2,200+ Happy Clients Milestone",
      description: "Expanded to serve 2,200+ clients with 97.3% satisfaction rate",
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full px-4 py-16 md:py-24 bg-gradient-to-b from-indigo-600/20 to-transparent">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center justify-center gap-3 mb-6 px-4 py-2 bg-indigo-500/20 border border-indigo-500/50 rounded-full">
              <Award className="w-5 h-5 text-indigo-400" />
              <span className="text-indigo-300 font-semibold">Professional Credentials</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Certificates & Achievements
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Professional certifications, industry recognitions, and major milestones that demonstrate expertise and commitment to excellence
            </p>
          </div>
        </section>

        {/* Certificates Gallery */}
        <section className="w-full px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4 text-center">Professional Certifications</h2>
            <p className="text-slate-300 text-center mb-16 max-w-2xl mx-auto">
              Industry-recognized certifications validating expertise in digital marketing, Meta technical solutions, and digital asset management
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all hover:bg-white/10"
                >
                  {/* Certificate Image */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500/20 to-purple-500/20 h-64">
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%234F46E5' width='400' height='300'/%3E%3Ctext x='50%' y='50%' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3E{cert.title}%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Certificate Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{cert.title}</h3>
                        <p className="text-indigo-400 font-semibold">{cert.issuer}</p>
                      </div>
                      <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/50 rounded-full text-indigo-300 text-sm font-semibold">
                        {cert.date}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mb-4">{cert.description}</p>
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:scale-105"
                    >
                      View Certificate
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Timeline */}
        <section className="w-full px-4 py-16 md:py-24 bg-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4 text-center">Major Milestones</h2>
            <p className="text-slate-300 text-center mb-16 max-w-2xl mx-auto">
              Key achievements and milestones in the journey of building Connect With Bayezid
            </p>

            <div className="space-y-8">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="flex gap-6 md:gap-8">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {index !== achievements.length - 1 && (
                        <div className="w-1 h-24 bg-gradient-to-b from-indigo-500 to-purple-600 mt-4" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pt-2 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-indigo-400">{achievement.year}</span>
                        <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{achievement.title}</h3>
                      <p className="text-slate-300 text-lg">{achievement.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Work With a Certified Expert?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Let's discuss how my expertise and proven track record can help achieve your digital goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/message/TDYG575YENF6F1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105"
              >
                Start Your Project
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
              >
                Get More Info
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
