import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ChevronRight, Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";

/**
 * Design Philosophy: Professional Contact Page
 * - Clear contact information with multiple channels
 * - Map integration for location visibility
 * - WhatsApp direct messaging
 * - Professional layout with gradient accents
 */

export default function Contact() {
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
            <span className="text-white">Contact</span>
          </div>

          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h1>
            <p className="text-lg text-slate-300">We're here to help and answer any question you might have</p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Contact Information */}
            <div className="space-y-8">
              {/* Email */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Email</h3>
                    <a href="mailto:cwb.agency@outlook.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      cwb.agency@outlook.com
                    </a>
                    <p className="text-slate-400 text-sm mt-2">We'll respond within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">WhatsApp</h3>
                    <a href="https://wa.me/01519601517" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      +880 1519 601 517
                    </a>
                    <p className="text-slate-400 text-sm mt-2">Chat with us directly on WhatsApp</p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Phone</h3>
                    <a href="tel:+880-1519-601-517" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      +880 1519 601 517
                    </a>
                    <p className="text-slate-400 text-sm mt-2">Call us during business hours</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Location</h3>
                    <p className="text-slate-300 mb-2">
                      Auliabad, Kalihati<br />
                      Tangail, Dhaka, Bangladesh
                    </p>
                    <a href="https://maps.app.goo.gl/PqG45pfvditVMPY79?g_st=ic" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm">
                      View on Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Card */}
            <div className="flex flex-col gap-6">
              {/* Map Embed */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.5577777777776!2d89.91666666666667!3d24.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sAuliabad%2C%20Kalihati%2C%20Tangail%2C%20Dhaka%2C%20Bangladesh!2s24.3%2C89.9167!5e0!3m2!1sen!2sbd!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Connect With Bayezid Location"
                />
              </div>

              {/* Quick Contact Card */}
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Quick Response</h3>
                <p className="text-slate-300 mb-6">
                  Need immediate assistance? Connect with us on WhatsApp for instant replies and quick consultations.
                </p>
                <a
                  href="https://wa.me/message/TDYG575YENF6F1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all hover:scale-105 w-full justify-center"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </a>
              </div>

              {/* Business Hours */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Business Hours</h3>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li><span className="font-semibold">Monday - Friday:</span> 9:00 AM - 6:00 PM</li>
                      <li><span className="font-semibold">Saturday:</span> 10:00 AM - 4:00 PM</li>
                      <li><span className="font-semibold">Sunday:</span> Closed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
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
