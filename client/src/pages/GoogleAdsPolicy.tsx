import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

/**
 * Design Philosophy: Professional Legal Document
 * - Clean, readable layout with clear hierarchy
 * - Consistent with site design using gradient accents
 * - Easy navigation with breadcrumbs
 * - Accessible typography for long-form content
 */

export default function GoogleAdsPolicy() {
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
            <span className="text-white">Google Ads Policy</span>
          </div>

          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Google Ads Policy</h1>
            <p className="text-slate-400">Last updated: April 15, 2026</p>
          </div>

          {/* Content */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Overview</h2>
              <p className="text-slate-300 leading-relaxed">
                Connect With Bayezid uses Google Ads and other advertising services to promote our products and services. This policy outlines how we comply with Google's advertising policies and regulations.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Compliance with Google Policies</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We are committed to complying with all Google Ads policies, including:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                <li>Prohibited content policies</li>
                <li>Restricted content policies</li>
                <li>Editorial and professional requirements</li>
                <li>Advertising practices policies</li>
                <li>Technical requirements</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Prohibited Content</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We do not create, publish, or promote ads containing:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                <li>Illegal products or services</li>
                <li>Misleading or deceptive content</li>
                <li>Hate speech or discrimination</li>
                <li>Violence or dangerous activities</li>
                <li>Adult content or sexual material</li>
                <li>Intellectual property violations</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Privacy and Tracking</h2>
              <p className="text-slate-300 leading-relaxed">
                We comply with all data privacy regulations including GDPR, CCPA, and other applicable laws. We use Google Analytics and conversion tracking only with proper user consent and transparent disclosure. All personal data collected through ads is handled according to our Privacy Policy.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Ad Quality and Transparency</h2>
              <p className="text-slate-300 leading-relaxed">
                All our advertisements are:
              </p>
              <ul className="list-disc list-inside text-slate-300 mt-4 space-y-2">
                <li>Accurate and truthful in all claims</li>
                <li>Clearly identified as advertisements</li>
                <li>Free from misleading or deceptive practices</li>
                <li>Compliant with all applicable regulations</li>
                <li>Respectful of user privacy and preferences</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Landing Page Requirements</h2>
              <p className="text-slate-300 leading-relaxed">
                Landing pages linked from our ads:
              </p>
              <ul className="list-disc list-inside text-slate-300 mt-4 space-y-2">
                <li>Match the content and claims in the advertisement</li>
                <li>Provide clear information about products/services</li>
                <li>Display accurate pricing and terms</li>
                <li>Include proper contact information</li>
                <li>Are mobile-friendly and load quickly</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Prohibited Practices</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We do not engage in:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                <li>Click fraud or artificial engagement</li>
                <li>Keyword stuffing or misleading keywords</li>
                <li>Cloaking or redirects to different content</li>
                <li>Malware or unwanted software distribution</li>
                <li>Phishing or social engineering</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Policy Violations</h2>
              <p className="text-slate-300 leading-relaxed">
                If we become aware of any policy violations, we take immediate corrective action. We maintain compliance monitoring and regular audits to ensure adherence to all Google Ads policies.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Contact & Support</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                For questions about our Google Ads practices or this policy:
              </p>
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-slate-300">
                  <strong className="text-white">Connect With Bayezid</strong><br />
                  Email: <a href="mailto:cwb.agency@outlook.com" className="text-indigo-400 hover:text-indigo-300">cwb.agency@outlook.com</a><br />
                  LinkedIn: <a href="https://www.linkedin.com/in/sayadbayezid" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Sayad Md Bayezid Hosan</a>
                </p>
              </div>
            </section>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105">
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
