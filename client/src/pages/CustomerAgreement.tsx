import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ChevronRight, CheckCircle, AlertCircle, CreditCard, Smartphone, DollarSign, Copy, Check, Upload, Send, Trash2, Eye } from "lucide-react";
import { useState } from "react";

/**
 * Design Philosophy: Customer Agreement Page
 * - Clear payment options and methods
 * - Refund policy details
 * - Terms & conditions checklist
 * - Payment confirmation submission
 * - Admin panel for payment management
 * - Professional and trustworthy design
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

export default function CustomerAgreement() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<PaymentSubmission | null>(null);

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

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const allChecked = checkedItems.length === 4; // terms, privacy, refund, payment

  const handleAdminLogin = () => {
    if (adminPassword === "smbsmb64") {
      setIsAdminAuthenticated(true);
      setAdminPassword("");
    } else {
      alert("Invalid password");
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
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
    setShowPaymentForm(false);

    alert("Payment confirmation submitted! WhatsApp message sent.");
  };

  const handleConfirmPayment = (id: string) => {
    setSubmissions(
      submissions.map((sub) => (sub.id === id ? { ...sub, status: "confirmed" } : sub))
    );

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

  const bangladeshPayments = [
    {
      id: "bkash",
      name: "bKash",
      number: "01791527854",
      icon: "📱",
      color: "from-pink-500 to-rose-600",
    },
    {
      id: "nagad",
      name: "Nagad / Rocket",
      number: "01519601517",
      icon: "📱",
      color: "from-orange-500 to-red-600",
    },
  ];

  const bankPayments = [
    {
      id: "eastern",
      name: "Eastern Bank PLC",
      details: {
        "Account Number": "1651440006284",
        "Account Holder": "Sayad Md Bayezid Hosan",
        "Branch": "Tangail Branch",
        "Country": "Bangladesh",
      },
      icon: "🏦",
      color: "from-blue-500 to-indigo-600",
    },
  ];

  const internationalPayments = [
    {
      id: "paypal",
      name: "PayPal",
      details: {
        "Email": "bayxed4@gmail.com",
        "Supported": "Worldwide",
      },
      icon: "💳",
      color: "from-blue-600 to-blue-700",
    },
    {
      id: "payoneer-usa",
      name: "Payoneer (USA)",
      details: {
        "Bank Name": "Citibank",
        "Account Number": "70580060002254420",
        "Routing (ABA)": "031100209",
        "SWIFT Code": "CITIUS33",
        "Bank Address": "111 Wall Street New York, NY 10043 USA",
        "Account Type": "CHECKING",
        "Beneficiary": "Sayad Md Bayezid Hosan",
      },
      icon: "🌍",
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "payoneer-eur",
      name: "Payoneer (EUR)",
      details: {
        "Bank Name": "Banking Circle S.A.",
        "IBAN": "LU664080000045710578",
        "BIC": "BCIRLULL",
        "Bank Address": "2, Boulevard de la Foire L-1528 LUXEMBOURG",
        "Beneficiary": "Sayad Md Bayezid Hosan",
      },
      icon: "🌍",
      color: "from-purple-500 to-pink-600",
    },
    {
      id: "payoneer-gbp",
      name: "Payoneer (GBP)",
      details: {
        "Bank Name": "Barclays",
        "Sort Code": "231486",
        "Account Number": "15937397",
        "Bank Address": "Level 25, 1 Churchill Place London E14 5HP",
        "Beneficiary": "Sayad Md Bayezid Hosan",
      },
      icon: "🌍",
      color: "from-red-500 to-orange-600",
    },
  ];

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
            <span className="text-white">Customer Agreement</span>
          </div>

          {/* Page Header */}
          <div className="mb-12 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Customer Agreement & Payment</h1>
              <p className="text-lg text-slate-300">Review terms, submit payment confirmation, and manage your account</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentForm(!showPaymentForm)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105"
              >
                <Upload className="w-5 h-5" />
                Submit Payment
              </button>
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all hover:scale-105"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-500/20 border border-amber-500/50 rounded-2xl p-6 mb-12 flex gap-4">
            <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-amber-300 mb-2">⚠️ Important Notice</h3>
              <p className="text-amber-100">
                Payment must be completed before contacting us or initiating any service. Submit your payment confirmation below after making payment.
              </p>
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
                {submissions.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">No payment submissions yet</div>
                ) : (
                  submissions.map((submission) => (
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
                            Confirm & WhatsApp
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
                        </div>
                      )}

                      {submission.status === "rejected" && submission.notes && (
                        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-red-200 text-sm">
                          <strong>Rejection Reason:</strong> {submission.notes}
                        </div>
                      )}

                      {submission.status === "confirmed" && (
                        <div className="p-3 bg-green-500/20 border border-green-500/30 rounded text-green-200 text-sm">
                          ✅ Payment confirmed and customer notified
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
                  ))
                )}
              </div>
            </div>
          )}

          {/* Payment Submission Form */}
          {showPaymentForm && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Submit Payment Confirmation</h2>
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
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
                      setShowPaymentForm(false);
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

          {/* Terms & Conditions Checklist */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Terms & Conditions Checklist</h2>
            <div className="space-y-4 mb-8">
              {[
                {
                  id: "terms",
                  label: "I have read and agree to the Terms & Conditions",
                  link: "#terms-conditions",
                },
                {
                  id: "privacy",
                  label: "I have read and agree to the Privacy Policy",
                  link: "/privacy-policy",
                },
                {
                  id: "refund",
                  label: "I understand and accept the Refund Policy",
                  link: "#refund-policy",
                },
                {
                  id: "payment",
                  label: "I confirm payment has been made and agree to the payment terms",
                  link: "#payment-methods",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      checkedItems.includes(item.id)
                        ? "bg-green-500 border-green-500"
                        : "border-slate-400 group-hover:border-indigo-400"
                    }`}
                  >
                    {checkedItems.includes(item.id) && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <label className="flex-1 cursor-pointer">
                    <span className="text-white font-semibold">{item.label}</span>
                    <Link href={item.link} className="text-indigo-400 hover:text-indigo-300 text-sm ml-2">
                      View →
                    </Link>
                  </label>
                </div>
              ))}
            </div>

            {allChecked && (
              <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-semibold">All terms accepted! You're ready to proceed.</span>
              </div>
            )}
          </div>

          {/* Refund Policy */}
          <div id="refund-policy" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Refund Policy</h2>
            <div className="space-y-6 text-slate-300">
              <div>
                <h3 className="text-lg font-bold text-indigo-300 mb-3">Refund Eligibility</h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Refunds are available within 7 days of payment if no work has been started</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Once project work has commenced, no refunds are available</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Partial refunds may be considered for incomplete deliverables with valid justification</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-indigo-300 mb-3">Refund Process</h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex gap-3">
                    <span className="font-bold text-white">1.</span>
                    <span>Submit refund request with detailed reason within 7 days</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-white">2.</span>
                    <span>We will review and respond within 3-5 business days</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-white">3.</span>
                    <span>Approved refunds will be processed within 5-7 business days</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-white">4.</span>
                    <span>Bank transfer refunds may take 7-14 days depending on your bank</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                <p className="text-blue-200">
                  <strong>Note:</strong> Mobile payment refunds (bKash, Nagad, Rocket) will be processed to the original account within 24-48 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods Section */}
          <div id="payment-methods" className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Payment Methods</h2>

            {/* Bangladesh Payments */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-indigo-300 mb-6 flex items-center gap-2">
                <Smartphone className="w-6 h-6" />
                Bangladesh Mobile Money
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bangladeshPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className={`bg-gradient-to-br ${payment.color} rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105`}
                  >
                    <div className="text-4xl mb-4">{payment.icon}</div>
                    <h4 className="text-2xl font-bold mb-4">{payment.name}</h4>
                    <div className="bg-white/20 rounded-lg p-4 mb-4">
                      <p className="text-sm opacity-90 mb-2">Phone Number:</p>
                      <p className="text-2xl font-mono font-bold">{payment.number}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(payment.number, payment.id)}
                      className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                    >
                      {copiedText === payment.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Number
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Transfer */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-indigo-300 mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                Bangladesh Bank Transfer
              </h3>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                {bankPayments.map((bank) => (
                  <div key={bank.id} className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-3xl">{bank.icon}</span>
                      <h4 className="text-2xl font-bold text-white">{bank.name}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(bank.details).map(([key, value]) => (
                        <div key={key} className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <p className="text-slate-400 text-sm mb-1">{key}</p>
                          <p className="text-white font-bold text-lg">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* International Payments */}
            <div>
              <h3 className="text-2xl font-bold text-indigo-300 mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                International Payments
              </h3>

              {/* PayPal */}
              <div className="mb-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">💳</span>
                  <h4 className="text-2xl font-bold">PayPal</h4>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm opacity-90 mb-2">Email Address:</p>
                  <p className="text-xl font-mono font-bold mb-4">bayxed4@gmail.com</p>
                  <button
                    onClick={() => copyToClipboard("bayxed4@gmail.com", "paypal")}
                    className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {copiedText === "paypal" ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Email
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Payoneer Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {internationalPayments.slice(1).map((payment) => (
                  <div key={payment.id} className={`bg-gradient-to-br ${payment.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105`}>
                    <div className="text-3xl mb-3">{payment.icon}</div>
                    <h4 className="text-xl font-bold mb-4">{payment.name}</h4>
                    <div className="space-y-3 text-sm">
                      {Object.entries(payment.details).map(([key, value]) => (
                        <div key={key} className="bg-white/20 rounded p-2">
                          <p className="opacity-80 text-xs">{key}:</p>
                          <p className="font-mono font-bold text-xs break-all">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-indigo-100 mb-8 text-lg">
              Complete your payment, submit confirmation above, then contact us to begin your project.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-slate-100 transition-all hover:scale-105">
              Contact Us After Payment
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
