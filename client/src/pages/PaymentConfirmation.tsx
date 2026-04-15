import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ChevronRight, Upload, Send, CheckCircle, AlertCircle, Trash2, Eye } from "lucide-react";
import { useState } from "react";

/**
 * Design Philosophy: Payment Confirmation Page
 * - Easy payment proof submission
 * - WhatsApp integration for notifications
 * - Admin panel for payment confirmation
 * - Professional and secure design
 */

interface PaymentSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  paymentMethod: string;
  transactionId: string;
  amount: string;
  screenshot?: string;
  proof?: string;
  submittedAt: string;
  status: "pending" | "confirmed" | "rejected";
  notes?: string;
}

export default function PaymentConfirmation() {
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>([
    {
      id: "demo-1",
      name: "Demo Customer",
      email: "demo@example.com",
      phone: "01791527854",
      paymentMethod: "bKash",
      transactionId: "ABC123456",
      amount: "5000",
      submittedAt: new Date().toISOString(),
      status: "pending",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "",
    transactionId: "",
    amount: "",
    screenshot: "",
    proof: "",
  });

  const [selectedSubmission, setSelectedSubmission] = useState<PaymentSubmission | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleAdminLogin = () => {
    // Simple password check (in production, use proper authentication)
    if (adminPassword === "admin123") {
      setIsAdminAuthenticated(true);
      setAdminPassword("");
    } else {
      alert("Invalid password");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.paymentMethod ||
      !formData.transactionId ||
      !formData.amount
    ) {
      alert("Please fill all required fields");
      return;
    }

    const newSubmission: PaymentSubmission = {
      id: Date.now().toString(),
      ...formData,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    setSubmissions([newSubmission, ...submissions]);

    // Send to WhatsApp
    const message = `
🎉 *New Payment Confirmation Received*

*Customer Details:*
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

*Payment Details:*
Method: ${formData.paymentMethod}
Transaction ID: ${formData.transactionId}
Amount: ${formData.amount} BDT

*Proof:* ${formData.proof || "Text description provided"}

Please review and confirm payment in the admin panel.
    `;

    const whatsappUrl = `https://wa.me/message/TDYG575YENF6F1?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      paymentMethod: "",
      transactionId: "",
      amount: "",
      screenshot: "",
      proof: "",
    });
    setShowForm(false);

    alert("Payment confirmation submitted! WhatsApp message sent.");
  };

  const handleConfirmPayment = (id: string) => {
    setSubmissions(
      submissions.map((sub) => (sub.id === id ? { ...sub, status: "confirmed" } : sub))
    );

    // Get the submission details
    const submission = submissions.find((sub) => sub.id === id);
    if (submission) {
      const confirmMessage = `✅ *Payment Confirmed*\n\nDear ${submission.name},\n\nYour payment of ${submission.amount} BDT has been confirmed. We will start working on your project shortly.\n\nThank you for choosing Connect With Bayezid!`;
      const whatsappUrl = `https://wa.me/${submission.phone}?text=${encodeURIComponent(confirmMessage)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  const handleRejectPayment = (id: string, reason: string) => {
    setSubmissions(
      submissions.map((sub) =>
        sub.id === id ? { ...sub, status: "rejected", notes: reason } : sub
      )
    );
  };

  const handleDeleteSubmission = (id: string) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      setSubmissions(submissions.filter((sub) => sub.id !== id));
    }
  };

  const paymentMethods = [
    "bKash - 01791527854",
    "Nagad - 01519601517",
    "Rocket - 01519601517",
    "Eastern Bank - 1651440006284",
    "PayPal - bayxed4@gmail.com",
    "Payoneer USA",
    "Payoneer EUR",
    "Payoneer GBP",
  ];

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const confirmedCount = submissions.filter((s) => s.status === "confirmed").length;

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
            <span className="text-white">Payment Confirmation</span>
          </div>

          {/* Page Header */}
          <div className="mb-12 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Payment Confirmation</h1>
              <p className="text-lg text-slate-300">Submit your payment proof and transaction details</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105"
              >
                <Upload className="w-5 h-5" />
                Submit Payment
              </button>
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all hover:scale-105"
              >
                Admin Panel
              </button>
            </div>
          </div>

          {/* Admin Login */}
          {showAdmin && !isAdminAuthenticated && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>
              <div className="flex gap-3 max-w-md">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleAdminLogin}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  Login
                </button>
              </div>
              <p className="text-slate-400 text-sm mt-4">Hint: Use 'admin123' as password</p>
            </div>
          )}

          {/* Admin Panel */}
          {showAdmin && isAdminAuthenticated && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
                <button
                  onClick={() => {
                    setIsAdminAuthenticated(false);
                    setShowAdmin(false);
                  }}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  Logout
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Total Submissions</p>
                  <p className="text-3xl font-bold text-white">{submissions.length}</p>
                </div>
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                  <p className="text-yellow-200 text-sm">Pending</p>
                  <p className="text-3xl font-bold text-yellow-300">{pendingCount}</p>
                </div>
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                  <p className="text-green-200 text-sm">Confirmed</p>
                  <p className="text-3xl font-bold text-green-300">{confirmedCount}</p>
                </div>
              </div>

              {/* Submissions List */}
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`border rounded-lg p-4 ${
                      submission.status === "pending"
                        ? "bg-yellow-500/10 border-yellow-500/30"
                        : submission.status === "confirmed"
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-red-500/10 border-red-500/30"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{submission.name}</h3>
                        <p className="text-slate-400 text-sm">{submission.email}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          submission.status === "pending"
                            ? "bg-yellow-500/30 text-yellow-300"
                            : submission.status === "confirmed"
                              ? "bg-green-500/30 text-green-300"
                              : "bg-red-500/30 text-red-300"
                        }`}
                      >
                        {submission.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                      <div>
                        <p className="text-slate-400">Payment Method</p>
                        <p className="text-white font-bold">{submission.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Transaction ID</p>
                        <p className="text-white font-bold">{submission.transactionId}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Amount</p>
                        <p className="text-white font-bold">{submission.amount} BDT</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Phone</p>
                        <p className="text-white font-bold">{submission.phone}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {submission.status === "pending" && (
                      <div className="flex gap-3 flex-wrap">
                        <button
                          onClick={() => handleConfirmPayment(submission.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Confirm & Send WhatsApp
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt("Enter rejection reason:");
                            if (reason) handleRejectPayment(submission.id, reason);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowDetails(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    )}

                    {submission.status === "rejected" && submission.notes && (
                      <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-red-200 text-sm">
                        <strong>Rejection Reason:</strong> {submission.notes}
                      </div>
                    )}

                    {submission.status === "confirmed" && (
                      <div className="p-3 bg-green-500/20 border border-green-500/30 rounded text-green-200 text-sm">
                        ✅ Payment confirmed and customer notified via WhatsApp
                      </div>
                    )}

                    <button
                      onClick={() => handleDeleteSubmission(submission.id)}
                      className="mt-3 flex items-center gap-2 px-3 py-1 bg-slate-600/50 text-slate-300 text-sm rounded hover:bg-slate-600 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Submission Form */}
          {showForm && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Submit Payment Confirmation</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Details */}
                <div>
                  <h3 className="text-lg font-bold text-indigo-300 mb-4">Your Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Payment Details */}
                <div>
                  <h3 className="text-lg font-bold text-indigo-300 mb-4">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      required
                    >
                      <option value="">Select Payment Method *</option>
                      {paymentMethods.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Transaction ID / Reference *"
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Amount (BDT) *"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Proof */}
                <div>
                  <h3 className="text-lg font-bold text-indigo-300 mb-4">Payment Proof</h3>
                  <textarea
                    placeholder="Describe your payment proof (screenshot details, reference number, etc.) or paste transaction details here"
                    value={formData.proof}
                    onChange={(e) => setFormData({ ...formData, proof: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                  <p className="text-slate-400 text-sm mt-2">
                    Include transaction ID, payment time, sender name, or any other relevant details
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all hover:scale-105"
                  >
                    <Send className="w-5 h-5" />
                    Submit & Send to WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        paymentMethod: "",
                        transactionId: "",
                        amount: "",
                        screenshot: "",
                        proof: "",
                      });
                    }}
                    className="flex-1 px-6 py-3 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-2xl p-6 mb-12 flex gap-4">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-blue-300 mb-2">How It Works</h3>
              <ol className="text-blue-200 space-y-1 text-sm">
                <li>1. Click "Submit Payment" and fill in your payment details</li>
                <li>2. Include transaction ID, screenshot, or proof of payment</li>
                <li>3. Submit the form - it will be sent to our WhatsApp</li>
                <li>4. We will verify and confirm your payment</li>
                <li>5. You'll receive a WhatsApp confirmation when payment is verified</li>
              </ol>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
