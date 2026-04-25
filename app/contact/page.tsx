"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import CloudBackground from "@/components/ui/CloudBackground";
import Breadcrumb from "@/components/ui/Breadcrumb";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";
import { routes } from "@/config/routes";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <>
      <CloudBackground heightClassName="min-h-[50vh]">
        <Navbar />
        <div className="mx-auto w-full px-4 py-16 sm:px-6 lg:w-[80%] lg:px-0">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow sm:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            We'd love to hear from you. Have a question? Reach out to our team anytime.
          </p>
        </div>
      </CloudBackground>

      <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:w-[80%] lg:px-0">
        <Breadcrumb
          items={[
            { label: "Home", href: routes.home },
            { label: "Contact" },
          ]}
        />
      </div>

      <section className="mx-auto w-full px-4 py-16 sm:px-6 lg:w-[80%] lg:px-0">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Contact Information</h2>
            </div>

            {[
              {
                icon: Mail,
                label: "Email",
                value: "support@hotelix.com",
                subtext: "We'll respond within 24 hours"
              },
              {
                icon: Phone,
                label: "Phone",
                value: "+998 71 200 3333",
                subtext: "Available 24/7"
              },
              {
                icon: MapPin,
                label: "Office",
                value: "Tashkent, Uzbekistan",
                subtext: "Mirabad District"
              },
              {
                icon: Clock,
                label: "Business Hours",
                value: "Monday - Friday",
                subtext: "9:00 AM - 6:00 PM UTC+5"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex gap-4">
                  <Icon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.label}</h3>
                    <p className="text-slate-900 mt-1">{item.value}</p>
                    <p className="text-slate-500 text-sm mt-0.5">{item.subtext}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>

              {submitted && (
                <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
                  <p className="text-emerald-700 font-medium">
                    ✓ Thank you! We've received your message and will be in touch soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  >
                    <option value="">Select a subject</option>
                    <option value="booking">Booking Issue</option>
                    <option value="host">Host Inquiry</option>
                    <option value="payment">Payment Support</option>
                    <option value="general">General Question</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>

              <p className="mt-4 text-sm text-slate-500 text-center">
                We typically respond within 24 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto w-full px-4 py-16 sm:px-6 lg:w-[80%] lg:px-0">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-12">Frequently Asked Questions</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              question: "How do I become a host?",
              answer: "Click on 'Dashboard' in the navigation, then navigate to 'My Hotels' to list your property. Our team will verify your listing within 24 hours."
            },
            {
              question: "What are the payment options?",
              answer: "We accept all major credit cards, debit cards, and digital wallets. Payments are processed securely through our payment gateway."
            },
            {
              question: "How can I modify my booking?",
              answer: "Visit your bookings in the dashboard. Most bookings can be modified up to 48 hours before check-in."
            },
            {
              question: "What's your cancellation policy?",
              answer: "Cancellation policies vary by property. Check individual listings for their specific terms. Most support free cancellation within 48 hours."
            }
          ].map((faq, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900 mb-3">{faq.question}</h3>
              <p className="text-slate-600 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <FloatingChatWidget />
    </>
  );
}
